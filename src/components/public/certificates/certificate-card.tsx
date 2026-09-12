import { Award, ExternalLink } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";

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
  return (
    <article
      className={cn(
        "group flex h-full w-full flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30",
        className,
      )}
    >
      {certificate.imageUrl ? (
        <div className="relative h-40 w-full overflow-hidden rounded-md border border-border bg-muted/30">
          <CloudinaryImage
            src={certificate.imageUrl}
            alt={certificate.imageAlt || `${certificate.title} badge`}
            fill
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        </div>
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