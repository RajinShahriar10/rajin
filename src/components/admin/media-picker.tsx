"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Film, ImagePlus, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
  alt?: string | null;
  resourceType?: string | null;
  createdAt: string;
};

function isRenderableImage(url: string) {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url);
}

export function MediaPicker({
  value,
  onChange,
  entityType,
}: {
  value?: string;
  onChange: (url: string) => void;
  entityType?: string;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setItems(data.media ?? []);
    } catch {
      toast.error("Could not load media library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => load(), 0);
    return () => window.clearTimeout(id);
  }, [load]);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const result = await uploadFileToCloudinary(file);
      await indexMedia(result, { entityType });
      onChange(result.url);
      toast.success("Uploaded.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(item: MediaItem) {
    try {
      await deleteMediaFromCloudinary(item.publicId);
      if (value === item.url) onChange("");
      load();
      toast.success("Deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  }

  function renderThumb(item: MediaItem) {
    const isVideo = item.resourceType === "video";
    const thumbSrc = isVideo ? cloudinaryVideoThumb(item.url) : item.url;
    if (isVideo || isRenderableImage(item.url)) {
      return (
        <>
          <Image
            src={thumbSrc}
            alt={item.alt || "Media"}
            fill
            sizes="160px"
            className="object-cover"
          />
          {isVideo ? (
            <span className="absolute bottom-1 right-1 rounded bg-background/80 p-1">
              <Film className="h-3 w-3 text-muted-foreground" />
            </span>
          ) : null}
        </>
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/40 text-xs text-muted-foreground">
        {item.format ?? "File"}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="pr-8 font-mono text-xs"
          />
          {value ? (
            <button
              type="button"
              aria-label="Clear URL"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" onClick={load}>
              <Search className="h-3.5 w-3.5" />
              Browse media
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Media library</DialogTitle>
            </DialogHeader>
            <div className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
              {loading ? (
                <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                  Loading...
                </p>
              ) : items.length === 0 ? (
                <div className="col-span-full py-10 text-center">
                  <p className="text-sm text-muted-foreground">No media yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload an image or paste a URL.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square overflow-hidden rounded-md border border-border"
                  >
                    {renderThumb(item)}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onChange(item.url)}
                          aria-label="Use this media"
                        >
                          <ImagePlus className="h-4 w-4" />
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => handleDelete(item)}
                        aria-label="Delete media"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
