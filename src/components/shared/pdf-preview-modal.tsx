"use client";

import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cloudinaryAttachmentUrl } from "@/lib/cloudinary-url";
import { cn } from "@/lib/utils";

export function PdfPreviewModal({
  label,
  href,
  variant = "default",
  className,
}: {
  label: string;
  href?: string | null;
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive";
  className?: string;
}) {
  if (!href) return null;

  const downloadHref = cloudinaryAttachmentUrl(href);
  const forceDownload = downloadHref !== href;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant={variant} className={cn("w-full", className)}>
          <FileText className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <iframe
            src={href}
            title={`${label} preview`}
            className="h-[70vh] w-full"
          />
        </div>
        <div className="flex justify-end">
          <Button asChild>
            <a
              href={downloadHref}
              target="_blank"
              rel="noopener noreferrer"
              {...(forceDownload ? {} : { download: true })}
            >
              <Download className="h-4 w-4" />
              Download {label}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}