import { ArrowUpRight, FileText } from "lucide-react";
import { getSiteData } from "@/lib/data/site";
import { getSkills } from "@/lib/data/content";
import { buildMetadata } from "@/lib/metadata";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { Markdown } from "@/components/shared/markdown";
import { StatsGrid } from "@/components/shared/stats-grid";
import { SkillsSection } from "@/components/public/home/skills-section";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return buildMetadata({ title: "About", path: "/about" });
}

export default async function AboutPage() {
  const [{ profile, about, sectionMap }, skillCategories] = await Promise.all([
    getSiteData(),
    getSkills(),
  ]);

  const bio = profile?.bio || about?.content || "";
  const stats = about?.stats ?? [];
  const imageUrl = about?.imageUrl || profile?.profileImageUrl;
  const imageAlt = about?.imageAlt || profile?.profileImageAlt || profile?.name;

  return (
    <>
      <PageHeader
        eyebrow="Introduction"
        title={profile?.name || "About Me"}
        description={profile?.title || undefined}
      />

      <section className="container-page pb-24 pt-12">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-card">
              {imageUrl ? (
                <CloudinaryImage
                  src={imageUrl}
                  alt={imageAlt || "Profile"}
                  fill
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  transform={{ aspect: "4:5", crop: true }}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="font-display text-6xl font-semibold text-primary/30">
                    {profile?.name?.slice(0, 2).toUpperCase()}
                  </p>
                </div>
              )}
            </div>

            {profile?.resumeUrl ? (
              <Button asChild className="mt-6 w-full">
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" />
                  Download resume
                  <ArrowUpRight />
                </a>
              </Button>
            ) : null}

            {stats.length > 0 ? <StatsGrid stats={stats} className="mt-6" /> : null}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <Markdown content={bio} />
            </div>
          </Reveal>

          {about?.focus ? (
            <Reveal delay={0.15} className="mt-8">
              <p className="tech-label mb-3">Focus areas</p>
              <div className="flex flex-wrap gap-2">
                {about.focus
                  .split(",")
                  .map((area) => area.trim())
                  .filter(Boolean)
                  .map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-primary/30 bg-accent-soft px-3 py-1 text-sm text-foreground"
                    >
                      {area}
                    </span>
                  ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {about?.principles?.length ? (
        <section className="container-page pb-24">
          <Reveal>
            <p className="tech-label mb-4">Principles</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {about.principles.map((principle, i) => (
                <Reveal key={principle.id} delay={i * 0.05}>
                  <div className="h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30">
                    <h3 className="font-display text-base font-semibold tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {principle.summary}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {sectionMap.skills?.visible !== false && skillCategories.length > 0 ? (
        <SkillsSection categories={skillCategories} />
      ) : null}
    </>
  );
}
