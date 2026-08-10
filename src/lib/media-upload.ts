/**
 * Browser-side Cloudinary upload + library indexing.
 *
 * Uploads are signed server-side via `/api/media/signature` so the API secret
 * never reaches the client. Every upload is also registered in the media
 * library so it can be reused across the site and associated with an entity.
 */

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
  format: string;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  resourceType: string;
};

export type MediaIndexOptions = {
  entityType?: string;
  entityId?: string;
  order?: number;
  alt?: string;
};

export async function uploadFileToCloudinary(
  file: File,
): Promise<CloudinaryUploadResult> {
  const sigRes = await fetch("/api/media/signature", { cache: "no-store" });
  if (!sigRes.ok) {
    throw new Error("Uploads are unavailable. Check Cloudinary configuration.");
  }
  const sig = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", sig.folder);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
    { method: "POST", body: formData },
  );
  if (!res.ok) throw new Error("Upload failed.");

  const data = await res.json();
  return {
    publicId: data.public_id,
    url: data.secure_url,
    format: data.format,
    width: data.width ?? null,
    height: data.height ?? null,
    bytes: data.bytes ?? null,
    resourceType: data.resource_type ?? "image",
  };
}

export async function indexMedia(
  result: CloudinaryUploadResult,
  options: MediaIndexOptions = {},
): Promise<void> {
  await fetch("/api/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...result, ...options }),
  });
}

export async function deleteMediaFromCloudinary(
  publicId: string,
): Promise<void> {
  const res = await fetch("/api/media", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
  if (!res.ok) throw new Error("Delete failed.");
}
