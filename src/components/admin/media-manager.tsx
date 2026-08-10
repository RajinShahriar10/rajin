"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Copy, Film, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { formatDate } from "@/lib/utils";
import {
  deleteMediaFromCloudinary,
  indexMedia,
  uploadFileToCloudinary,
} from "@/lib/media-upload";
import { cloudinaryVideoThumb } from "@/lib/cloudinary-url";

type MediaItem = {
  id: string;
  publicId: string;
  url: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  alt?: string | null;
  resourceType?: string | null;
  createdAt: string | Date;
};

function formatBytes(bytes?: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initial);
  const [configured, setConfigured] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    setItems(data.media ?? []);
    setConfigured(data.configured !== false);
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;
      setUploading(true);
      let succeeded = 0;
      try {
        for (const file of list) {
          try {
            const result = await uploadFileToCloudinary(file);
            await indexMedia(result);
            succeeded += 1;
          } catch {
            // continue uploading the rest
          }
        }
        if (succeeded > 0) {
          toast.success(succeeded === 1 ? "Uploaded." : `${succeeded} files uploaded.`);
          await refresh();
        } else {
          toast.error("Upload failed.");
        }
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [refresh],
  );

  async function handleDelete(item: MediaItem) {
    await deleteMediaFromCloudinary(item.publicId);
    setItems((prev) => prev.filter((m) => m.id !== item.id));
    toast.success("Deleted.");
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard?.writeText(item.url).catch(() => undefined);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {configured
            ? "Media lives in your Cloudinary account and is indexed here."
            : "Uploads are unavailable — add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to enable them."}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />
        <Button
          type="button"
          disabled={uploading || !configured}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload files"}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
          No media yet. Upload an image or video to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const isVideo = item.resourceType === "video";
            const thumbSrc = isVideo ? cloudinaryVideoThumb(item.url) : item.url;
            return (
              <div key={item.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="relative aspect-video bg-muted/40">
                  <CloudinaryImage
                    src={thumbSrc}
                    alt={item.alt || item.publicId}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    transform={{ aspect: "16:9", crop: true }}
                  />
                  {isVideo ? (
                    <span className="absolute bottom-2 right-2 rounded bg-background/80 p-1.5">
                      <Film className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1.5 p-3">
                  <p className="truncate font-mono text-xs" title={item.publicId}>
                    {item.publicId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                    {formatBytes(item.bytes)} · {formatDate(item.createdAt)}
                  </p>
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyUrl(item)}
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedId === item.id ? "Copied" : "Copy URL"}
                    </Button>
                    <DeleteButton
                      onDelete={async () => {
                        try {
                          await handleDelete(item);
                          return { ok: true };
                        } catch {
                          return { ok: false };
                        }
                      }}
                      confirmTitle="Delete this media?"
                      confirmDescription={`"${item.publicId}" will be removed from the library and Cloudinary.`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
