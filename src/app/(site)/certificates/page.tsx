import { Award, ExternalLink, Trophy } from "lucide-react";
import { getCertificates, getAchievements } from "@/lib/data/content";
import { formatDateLong } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";
import { SectionHeading } from "@/components/shared/section-heading";

export async function generateMetadata() {
  return buildMetadata({ title: "Certificates", path: "/certificates" });
}

export default async function CertificatesPage() {
  const [certificates, achievements] = await Promise.all([
    getCertificates(),
    getAchievements(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Credentials"
        title="Certificates & Achievements"
        description="Certifications, awards and milestones earned along the way."
      />
      <section className="container-page pb-24 pt-10">
        {certificates.length === 0 ? (
          <SectionEmpty
            title="No certificates yet"
            description="Credentials I earn will be listed here."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, i) => (
              <Reveal key={cert.id} delay={(i % 3) * 0.07}>
                <div className="flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30">
                  <div className="flex items-start justify-between gap-3">
                    {cert.imageUrl ? (
                      <div className="relative h-16 w-40 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30">
                        <CloudinaryImage
                          src={cert.imageUrl}
                          alt={cert.imageAlt || `${cert.title} badge`}
                          fill
                          sizes="10rem"
                          transform={{ aspect: "16:6", crop: true }}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
                        <Award className="h-4 w-4 text-primary" />
                      </span>
                    )}
                    {cert.issueDate ? (
                      <span className="tech-label">{formatDateLong(cert.issueDate)}</span>
                    ) : null}
                  </div>

                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-primary">{cert.issuer}</p>

                  {cert.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {cert.description}
                    </p>
                  ) : null}

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
                      Verify credential
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {achievements.length > 0 ? (
          <div className="mt-20">
            <SectionHeading eyebrow="Milestones" title="Achievements" />
            <div className="mt-8 flex flex-col gap-4">
              {achievements.map((item, i) => (
                <Reveal key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                  <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
                      <Trophy className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                      {item.date ? (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {formatDateLong(item.date)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
