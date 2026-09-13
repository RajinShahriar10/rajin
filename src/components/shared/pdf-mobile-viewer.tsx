"use client";

import { useEffect, useRef } from "react";

/**
 * Mobile-safe PDF preview: renders pages to <canvas> with PDF.js, because
 * mobile browsers cannot display PDFs in an iframe. Laid over the desktop
 * <iframe> path only on small/touch screens.
 */
export function PdfMobileViewer({ src, label }: { src: string; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    const notice = noticeRef.current;
    if (!container) return;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        let workerUrl = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        try {
          const probe = await fetch(workerUrl, { method: "HEAD" });
          if (!probe.ok) throw new Error("Worker not reachable");
        } catch {
          workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const doc = await pdfjs.getDocument(src).promise;
        if (cancelled) return;

        for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
          if (cancelled) break;
          const page = await doc.getPage(pageNumber);
          const widthPt = page.getViewport({ scale: 1 }).width;
          const scale = Math.min(2, (container.clientWidth || 800) / widthPt);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = "h-auto w-full";
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            continue;
          }
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          if (cancelled) break;
          container.appendChild(canvas);
          if (notice) notice.remove();
        }
        await doc.destroy();
      } catch {
        // Preview failed silently — the open-in-new-tab / download actions remain available.
      }
    })();

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [src]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="flex flex-col gap-3" />
      <p ref={noticeRef} className="text-sm text-muted-foreground">
        Loading preview…
      </p>
      <p className="sr-only">{label}</p>
    </div>
  );
}