"use client";

import { useState } from "react";
import { Award, ExternalLink, Maximize2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { ImageLightbox } from "@/components/shared/image-lightbox";

export type CertificateCardData = {
  id: string;
  title: string;
  issuer: string;
  issueDate?: Date | null;
  credentialId?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  description?: string | null;
};

export function CertificateCard({
  certificate,
  className,
}: {
  certificate: CertificateCardData;
  className?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <article
      className={cn(
        "group flex h-full w-full flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30",
        className,
      )}
    >
      {certificate.imageUrl ? (
        <>
          <div className="relative h-40 w-full overflow-hidden rounded-md border border-border bg-muted/30">
            <CloudinaryImage
              src={certificate.imageUrl}
              alt={certificate.imageAlt || `${certificate.title} badge`}
              fill
              sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Open ${certificate.title} image in fullscreen`}
              className="absolute inset-0 z-10 cursor-zoom-in"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="View certificate image fullscreen"
              className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <ImageLightbox
            src={certificate.imageUrl}
            alt={certificate.imageAlt || `${certificate.title} certificate`}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            backLabel="Back to certificates"
          />
        </>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
          <Award className="h-4 w-4 text-primary" />
        </span>
      )}

      <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
        {certificate.title}
      </h3>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{certificate.issuer}</span>
        {certificate.issueDate ? (
          <span className="tech-label">{formatDate(certificate.issueDate)}</span>
        ) : null}
      </div>

      {certificate.description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {certificate.description}
        </p>
      ) : null}

      {certificate.credentialId ? (
        <p className="text-xs text-muted-foreground">
          Credential ID: {certificate.credentialId}
        </p>
      ) : null}

      {certificate.url ? (
        <a
          href={certificate.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          Verify
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </article>
  );
}