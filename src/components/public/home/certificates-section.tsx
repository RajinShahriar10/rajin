import Link from "next/link";
import { ArrowRight, Award, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";

type CertificateData = {
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

export function CertificatesSection({
  certificates,
}: {
  certificates: CertificateData[];
}) {
  if (certificates.length === 0) {
    return (
      <section id="certificates" className="section-edge scroll-mt-24 py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Credentials" title="Certificates" />
          <Reveal className="mt-10">
            <SectionEmpty
              title="No certificates yet"
              description="Credentials I earn will be listed here."
            />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="section-edge scroll-mt-24 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Credentials"
          title="Certificates"
          description="Certifications and credentials I have earned."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Reveal key={cert.id} delay={(i % 3) * 0.07}>
              <div className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30">
                {cert.imageUrl ? (
                  <div className="relative h-24 w-full overflow-hidden rounded-md border border-border bg-muted/30">
                    <CloudinaryImage
                      src={cert.imageUrl}
                      alt={cert.imageAlt || `${cert.title} badge`}
                      fill
                      sizes="(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 100vw"
                      transform={{ aspect: "16:7", crop: true }}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
                    <Award className="h-4 w-4 text-primary" />
                  </span>
                )}

                <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
                  {cert.title}
                </h3>

                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{cert.issuer}</span>
                  {cert.issueDate ? (
                    <span className="tech-label">{formatDate(cert.issueDate)}</span>
                  ) : null}
                </div>

                {cert.credentialId ? (
                  <p className="text-xs text-muted-foreground">
                    Credential ID: {cert.credentialId}
                  </p>
                ) : null}

                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    Verify
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/certificates"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            View all certificates
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
