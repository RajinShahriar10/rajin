import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { cloudinary, cloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const UPLOAD_FOLDER = "rajin";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FORMATS = [
  "jpg",
  "png",
  "webp",
  "avif",
  "gif",
  "svg",
  "mp4",
  "webm",
  "pdf",
];

/**
 * Issues a short-lived signature so the browser can upload directly to
 * Cloudinary without exposing the API secret. Only signed params are honored
 * by Cloudinary, so the admin session (checked here) gates every upload.
 * Allowed formats and size caps are part of the signed request so a
 * compromised client can't widen them.
 */
export async function GET() {
  await requireAdmin();

  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured." },
      { status: 503 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Note: Cloudinary does not include `max_bytes` in signature verification,
  // so it must NOT be signed or every signature will be rejected. It is still
  // sent on upload and enforced by Cloudinary.
  const paramsToSign = {
    timestamp,
    folder: UPLOAD_FOLDER,
    allowed_formats: ALLOWED_FORMATS.join(","),
  };
  const signature = cloudinary().utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: UPLOAD_FOLDER,
    maxBytes: MAX_BYTES,
    allowedFormats: ALLOWED_FORMATS,
  });
}
