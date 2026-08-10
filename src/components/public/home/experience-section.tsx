import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";

type ExperienceData = {
  id: string;
  role: string;
  company: string;
  location?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  current?: boolean;
  description?: string | null;
  technologies?: string | null;
};

export function ExperienceSection({
  experiences,
}: {
  experiences: ExperienceData[];
}) {
  if (experiences.length === 0) {
    return (
      <section id="experience" className="section-edge scroll-mt-24 py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Career" title="Experience" />
          <Reveal className="mt-10">
            <SectionEmpty
              title="No experience added yet"
              description="My career timeline is being built — check back soon."
            />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="section-edge scroll-mt-24 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Career"
          title="Experience"
          description="A look at the roles and teams I have worked with."
        />

        <div className="relative mt-14 max-w-3xl">
          <div className="absolute left-0 top-0 h-full w-px bg-border sm:left-5" />

          <div className="flex flex-col gap-10">
            {experiences.map((experience, i) => {
              const tech = experience.technologies
                ?.split(",")
                .map((t) => t.trim())
                .filter(Boolean);

              return (
                <Reveal key={experience.id} delay={i * 0.05}>
                  <div className="relative pl-8 sm:pl-16">
                    <span className="absolute left-0 top-1.5 flex h-2.5 w-2.5 items-center justify-center sm:left-[18px]">
                      <span className="absolute h-2.5 w-2.5 rounded-full bg-primary/20" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>

                    <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-lg font-semibold tracking-tight">
                          {experience.role}
                        </h3>
                        <p className="tech-label">
                          {experience.startDate ? formatDate(experience.startDate) : "—"}
                          {" – "}
                          {experience.current
                            ? "Present"
                            : experience.endDate
                              ? formatDate(experience.endDate)
                              : "—"}
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-primary">
                        {experience.company}
                        {experience.location ? ` · ${experience.location}` : ""}
                      </p>

                      {experience.description ? (
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                          {experience.description}
                        </p>
                      ) : null}

                      {tech && tech.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {tech.map((t) => (
                            <span
                              key={t}
                              className="rounded border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10">
            <Link
              href="/experience"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              View full timeline
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
