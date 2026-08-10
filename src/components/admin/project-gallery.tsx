"use client";

import { useRef, useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import {
  GripVertical,
  Images,
  Loader2,
  Plus,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MediaPicker } from "@/components/admin/media-picker";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { cn } from "@/lib/utils";
import {
  deleteMediaFromCloudinary,
  indexMedia,
  uploadFileToCloudinary,
} from "@/lib/media-upload";

type GalleryImage = {
  id?: string | null;
  url: string;
  publicId?: string | null;
  alt?: string | null;
  order: number;
};

type GalleryItemProps = {
  field: GalleryImage & { id: string };
  index: number;
  isCover: boolean;
  onSetCover: (url: string) => void;
  onRemove: () => void;
  onAltChange: (value: string) => void;
};

function GalleryItem({
  field,
  index,
  isCover,
  onSetCover,
  onRemove,
  onAltChange,
}: GalleryItemProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={field}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, zIndex: 20 }}
      className={cn(
        "relative flex gap-3 rounded-md border bg-card p-3",
        isCover ? "border-primary/50" : "border-border",
      )}
    >
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
        <CloudinaryImage
          src={field.url}
          alt={field.alt || `Gallery image ${index + 1}`}
          fill
          sizes="128px"
          transform={{ aspect: "16:10", crop: true }}
        />
        {isCover ? (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
            <Star className="h-2.5 w-2.5 fill-current" />
            Cover
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <Input
          value={field.alt ?? ""}
          placeholder={`Alt text for image ${index + 1}`}
          className="h-9 text-sm"
          onChange={(e) => onAltChange(e.target.value)}
        />
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant={isCover ? "secondary" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => onSetCover(field.url)}
          >
            <Star className={cn("h-3.5 w-3.5", isCover && "fill-current")} />
            {isCover ? "Cover image" : "Set as cover"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={`Delete image ${index + 1}`}
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Drag to reorder image ${index + 1}`}
        onPointerDown={(e) => controls.start(e)}
        className="flex w-6 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </Reorder.Item>
  );
}

export function ProjectGalleryField({
  form,
  projectId,
}: {
  form: UseFormReturn;
  projectId?: string | null;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });
  const coverUrl = form.watch("primaryImageUrl");
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [draggingFiles, setDraggingFiles] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleReorder(ordered: Array<GalleryImage & { id: string }>) {
    const current = (form.getValues("images") as GalleryImage[]) ?? [];
    const byInternalId = new Map(fields.map((f, i) => [f.id, current[i]]));
    const next = ordered
      .map((f) => byInternalId.get(f.id))
      .filter((item): item is GalleryImage => Boolean(item))
      .map((item, index) => ({ ...item, order: index }));
    if (next.length > 0) {
      form.setValue("images", next as never, { shouldDirty: true });
    }
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setUploading(true);
    setUploadedCount(0);
    try {
      const existing = ((form.getValues("images") as GalleryImage[]) ?? []).length;
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        setCurrentName(file.name);
        try {
          const result = await uploadFileToCloudinary(file);
          await indexMedia(result, {
            entityType: "project",
            entityId: projectId ?? undefined,
            order: existing + i,
          });
          append({
            id: undefined,
            url: result.url,
            publicId: result.publicId,
            alt: "",
            order: existing + i,
          });
          setUploadedCount((count) => count + 1);
        } catch {
          toast.error(`Failed to upload ${file.name}.`);
        }
      }
      toast.success(
        uploadedCount > 0
          ? `${uploadedCount} more images added to the gallery.`
          : "Images added to the gallery.",
      );
    } finally {
      setUploading(false);
      setCurrentName(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemove(index: number, field: GalleryImage) {
    if (field.url && field.url === coverUrl) {
      form.setValue("primaryImageUrl", "", { shouldDirty: true });
    }
    if (field.publicId) {
      try {
        await deleteMediaFromCloudinary(field.publicId);
      } catch {
        // keep local removal even if Cloudinary cleanup fails
      }
    }
    remove(index);
  }

  function addFromLibrary(url: string) {
    if (!url) return;
    const order = ((form.getValues("images") as GalleryImage[]) ?? []).length;
    append({ id: undefined, url, publicId: undefined, alt: "", order });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Upload multiple images, drag to reorder, and mark one as the cover.
        </p>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Plus className="h-3.5 w-3.5" />
                From library
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add images from the media library</DialogTitle>
              </DialogHeader>
              <MediaPicker value="" onChange={addFromLibrary} entityType="project" />
            </DialogContent>
          </Dialog>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? "Uploading..." : "Upload images"}
          </Button>
        </div>
      </div>

      {uploading ? (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {currentName ? `Uploading ${currentName}...` : "Uploading..."}
          {uploadedCount > 0 ? ` (${uploadedCount} done)` : ""}
        </div>
      ) : null}

      {fields.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDraggingFiles(true);
          }}
          onDragLeave={() => setDraggingFiles(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDraggingFiles(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-10 text-center text-sm text-muted-foreground",
            draggingFiles && "border-primary bg-muted/30 text-primary",
          )}
        >
          <Images className="h-8 w-8 text-muted-foreground/40" strokeWidth={1} />
          No gallery images yet. Upload some or drop files here.
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={fields}
          onReorder={(ordered) =>
            handleReorder(ordered as Array<GalleryImage & { id: string }>)
          }
          className="space-y-3"
        >
          {fields.map((field, index) => (
            <GalleryItem
              key={field.id}
              field={field as GalleryImage & { id: string }}
              index={index}
              isCover={coverUrl === (field as GalleryImage).url}
              onSetCover={(url) =>
                form.setValue("primaryImageUrl", url, { shouldDirty: true })
              }
              onRemove={() => handleRemove(index, field as GalleryImage)}
              onAltChange={(value) =>
                form.setValue(`images.${index}.alt`, value, { shouldDirty: true })
              }
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
