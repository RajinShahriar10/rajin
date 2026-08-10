import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";

type EducationData = {
  id: string;
  degree: string;
  institution: string;
  location?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  current?: boolean;
  score?: string | null;
  description?: string | null;
};

export function EducationSection({ education }: { education: EducationData[] }) {
  if (education.length === 0) {
    return (
      <section id="education" className="scroll-mt-24">
        <SectionHeading eyebrow="Education" title="Education" />
        <Reveal className="mt-10">
          <SectionEmpty
            title="No education entries yet"
            description="My academic background will be listed here."
          />
        </Reveal>
      </section>
    );
  }

  return (
    <section id="education" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Education"
        title="Education"
        description="My academic background and qualifications."
      />

      <div className="relative mt-12 max-w-3xl">
        <div className="absolute left-0 top-0 h-full w-px bg-border sm:left-5" />

        <div className="flex flex-col gap-8">
          {education.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <div className="relative pl-8 sm:pl-16">
                <span className="absolute left-0 top-1.5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card sm:left-[1px]">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </span>

                <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {item.degree}
                    </h3>
                    <p className="tech-label">
                      {item.startYear ?? ""}
                      {item.startYear && item.endYear ? " – " : ""}
                      {item.current ? "Present" : (item.endYear ?? "")}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-primary">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>

                  {item.score ? (
                    <p className="mt-2 text-sm text-muted-foreground">{item.score}</p>
                  ) : null}

                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
