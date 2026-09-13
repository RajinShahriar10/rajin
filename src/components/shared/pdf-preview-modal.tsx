"use client";

import { useRef, useState } from "react";
import { Download, FileText, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PdfMobileViewer } from "@/components/shared/pdf-mobile-viewer";
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
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 767.98px)");

  if (!href) return null;

  const encoded = encodeURIComponent(href);
  const previewSrc = `/api/documents?url=${encoded}`;
  const downloadHref = `/api/documents?url=${encoded}&download=1`;

  async function loadPreview() {
    if (loading) return;
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch(previewSrc);
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const blob = await res.blob();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;
      setSrc(objectUrl);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) void loadPreview();
      }}
    >
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
          {isMobile ? (
            src ? (
              <PdfMobileViewer src={src} label={label} />
            ) : (
              <div className="flex h-[70vh] items-center justify-center text-sm text-muted-foreground">
                Loading preview…
              </div>
            )
          ) : (
            <iframe
              src={src ?? "about:blank"}
              title={`${label} preview`}
              className="h-[70vh] w-full"
            />
          )}
        </div>
        {failed ? (
          <p className="text-sm text-destructive">
            The file could not be loaded for preview. Use open in a new tab or download instead.
          </p>
        ) : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading preview…</p> : null}
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