import { readFile } from "node:fs/promises";
import { join, normalize, posix } from "node:path";
import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import { getCloudinaryPublicId } from "@/lib/cloudinary-url";
import { cloudinary, cloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const PDF_MIME = "application/pdf";

/**
 * Public document proxy.
 *
 * Cloudinary can refuse direct browser delivery of PDFs (401 on iframe
 * `<embed>` navigation and on `fl_attachment` links depending on the account's
 * delivery restrictions). This route fetches the document from the server and
 * rebroadcasts it with the correct headers, so the preview and the download
 * behave exactly like Google Drive regardless of Cloudinary's policy. If the
 * plain delivery URL is rejected, a signed Cloudinary URL is generated and
 * retried.
 *
 * SSRF-safe: only Cloudinary URLs for this account's cloud name, or
 * site-relative paths under /public, are accepted.
 */
function toCleanUrl(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch {
    return url;
  }
}

function allowedCloudinaryUrl(url: string): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}

function allowedLocalPath(url: string): boolean {
  if (!url.startsWith("/") || url.startsWith("//") || url.includes("\0")) {
    return false;
  }
  const normalized = posix.normalize(url);
  return !normalized.startsWith("..") && !normalized.includes("/../");
}

function fileNameFrom(url: string, fallback: string): string {
  const clean = url.split("?")[0];
  const base = clean.split("/").pop() || "";
  const name = base.replace(/["\\\r\n]/g, "").trim();
  return name ? name : fallback;
}

function signedPdfUrl(url: string): string | null {
  if (!cloudinaryConfigured()) return null;
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return null;
  return cloudinary().url(publicId, {
    resourceType: "image",
    format: "pdf",
    sign_url: true,
  });
}

function decompress(data: Buffer, encoding: string): Buffer {
  switch (encoding.trim().toLowerCase()) {
    case "gzip":
      return gunzipSync(data);
    case "deflate":
      return inflateSync(data);
    case "br":
      return brotliDecompressSync(data);
    default:
      return data;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim() ?? "";
  const download = searchParams.get("download") === "1";
  if (!rawUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  const url = toCleanUrl(rawUrl);
  const isCloud = allowedCloudinaryUrl(url);
  const isLocal = !isCloud && allowedLocalPath(url);
  if (!isCloud && !isLocal) {
    return new Response("Invalid document URL", { status: 400 });
  }

  const filename = fileNameFrom(url, "document.pdf");
  const disposition = download ? "attachment" : "inline";
  const contentDisposition = `${disposition}; filename="${filename}"`;

  if (isLocal) {
    const publicRoot = join(process.cwd(), "public");
    const filePath = normalize(join(publicRoot, url));
    if (!filePath.startsWith(publicRoot)) {
      return new Response("Invalid document URL", { status: 400 });
    }
    try {
      const buffer = await readFile(filePath);
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": PDF_MIME,
          "Content-Disposition": contentDisposition,
          "Content-Length": String(buffer.byteLength),
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      return new Response("Document not found", { status: 404 });
    }
  }

  let upstream: globalThis.Response | null = null;
  let directStatus = 0;
  let signedStatus = 0;
  let signedUrl: string | null = null;
  try {
    upstream = await fetch(url, { cache: "no-store" });
    directStatus = upstream.status;
  } catch {
    upstream = null;
  }
  if (!upstream?.ok) {
    signedUrl = signedPdfUrl(url);
    if (signedUrl) {
      try {
        const signedRes = await fetch(signedUrl, { cache: "no-store" });
        signedStatus = signedRes.status;
        if (signedRes.ok) upstream = signedRes;
      } catch {
        signedStatus = 0;
      }
    }
  }
  if (searchParams.get("debug") === "1") {
    let resource: unknown = null;
    const publicId = getCloudinaryPublicId(url);
    if (cloudinaryConfigured() && publicId) {
      try {
        resource = await cloudinary().api.resource(publicId, {
          resource_type: "image",
        });
      } catch (err) {
        resource = err instanceof Error ? { error: err.message } : { error: "unknown" };
      }
    }
    return new Response(
      JSON.stringify({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? null,
        configured: cloudinaryConfigured(),
        directStatus,
        signedStatus,
        signedUrl,
        publicId,
        contentType: upstream?.headers.get("content-type") ?? null,
        resource,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }
  if (!upstream?.ok) {
    return new Response("Unable to load document", { status: 502 });
  }

  const bytes = await upstream.arrayBuffer().catch(() => null);
  if (!bytes) {
    return new Response("Unable to load document", { status: 502 });
  }

  const encoding = upstream.headers.get("content-encoding");
  let payload: Buffer;
  if (encoding && encoding.toLowerCase() !== "identity") {
    try {
      payload = decompress(Buffer.from(bytes), encoding);
    } catch {
      return new Response("Unable to load document", { status: 502 });
    }
  } else {
    payload = Buffer.from(bytes);
  }

  return new Response(new Uint8Array(payload), {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? PDF_MIME,
      "Content-Disposition": contentDisposition,
      "Content-Length": String(payload.byteLength),
      "Cache-Control": "public, max-age=3600",
    },
  });
}