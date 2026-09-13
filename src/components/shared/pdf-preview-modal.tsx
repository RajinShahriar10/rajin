"use client";

import { Download, FileText, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  const encoded = encodeURIComponent(href);
  const previewSrc = `/api/documents?url=${encoded}`;
  const downloadHref = `/api/documents?url=${encoded}&download=1`;

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
            src={previewSrc}
            title={`${label} preview`}
            className="h-[70vh] w-full"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button asChild variant="outline">
            <a href={previewSrc} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </Button>
          <Button asChild>
            <a href={downloadHref} rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              Download {label}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}