import { readFile } from "node:fs/promises";
import { join, normalize, posix } from "node:path";
import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import { prisma } from "@/lib/prisma";
import { getCloudinaryPublicId } from "@/lib/cloudinary-url";
import { cloudinary, cloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const PDF_MIME = "application/pdf";

/**
 * Public document proxy. Resume/CV PDFs are stored in the database
 * (`blob:resume` / `blob:cv` tokens) so delivery never depends on a third
 * party. For legacy Cloudinary URLs the file is fetched server-side and
 * rebroadcast with the correct headers, with a signed-URL fallback.
 *
 * SSRF-safe: only `blob:` tokens, Cloudinary URLs for this account's cloud
 * name, or site-relative paths under /public are accepted.
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

  if (url === "blob:resume" || url === "blob:cv") {
    const isResume = url === "blob:resume";
    const about = await prisma.about.findUnique({ where: { id: "main" } });
    const content = isResume ? about?.resumeBlob : about?.cvBlob;
    if (!content) {
      return new Response("Document not found", { status: 404 });
    }
    const filename = isResume ? about?.resumePublicId : about?.cvPublicId;
    const disposition = download ? "attachment" : "inline";
    return new Response(new Uint8Array(content), {
      headers: {
        "Content-Type": PDF_MIME,
        "Content-Disposition": `${disposition}; filename="${
          filename || (isResume ? "Resume.pdf" : "CV.pdf")
        }"`,
        "Content-Length": String(content.byteLength),
        "Cache-Control": "private, max-age=3600",
      },
    });
  }

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
  try {
    upstream = await fetch(url, { cache: "no-store" });
  } catch {
    upstream = null;
  }
  if (!upstream?.ok) {
    const signed = signedPdfUrl(url);
    if (signed) {
      try {
        upstream = await fetch(signed, { cache: "no-store" });
      } catch {
        upstream = null;
      }
    }
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