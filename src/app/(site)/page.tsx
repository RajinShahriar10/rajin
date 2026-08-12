import { getSiteData, getSiteUrl, getNavItems } from "@/lib/data/site";
import { getFeaturedProjects } from "@/lib/data/home";
import {
  getSkills,
  getExperience,
  getEducation,
  getCertificates,
  getResearch,
  getAchievements,
} from "@/lib/data/content";
import { buildMetadata } from "@/lib/metadata";

import { HeroSection } from "@/components/public/home/hero";
import { TechMarquee } from "@/components/public/home/tech-marquee";
import { AboutPreview } from "@/components/public/home/about-preview";
import { SkillsSection } from "@/components/public/home/skills-section";
import { PinnedProjects } from "@/components/public/home/pinned-projects";
import { ExperienceSection } from "@/components/public/home/experience-section";
import { EducationSection } from "@/components/public/experience/education-section";
import { ResearchSection } from "@/components/public/home/research-section";
import { CertificatesSection } from "@/components/public/home/certificates-section";
import { AchievementsSection } from "@/components/public/home/achievements-section";
import { ContactCta } from "@/components/public/home/contact-cta";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";
import { JsonLd } from "@/components/shared/json-ld";
import { personSchema, websiteSchema } from "@/lib/json-ld";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function generateMetadata() {
  return buildMetadata({});
}

/**
 * Canonical homepage order. The rendered order is derived from the admin
 * `SectionSetting` rows (reorderable in /admin/settings); sections missing
 * from the database are appended after all configured ones in this order.
 */
const DEFAULT_SECTION_ORDER = [
  "hero",
  "marquee",
  "projects",
  "about",
  "skills",
  "experience",
  "education",
  "research",
  "certificates",
  "achievements",
  "contact",
] as const;

export default async function HomePage() {
  const [{ profile, hero, about, sectionMap, settings, sections, socialLinks }, navItems] =
    await Promise.all([getSiteData(), getNavItems()]);
  const siteUrl = await getSiteUrl();

  const configuredKeys = new Set(sections.map((s) => s.key));
  const rank = (key: (typeof DEFAULT_SECTION_ORDER)[number]) =>
    configuredKeys.has(key)
      ? sections.findIndex((s) => s.key === key)
      : DEFAULT_SECTION_ORDER.length + DEFAULT_SECTION_ORDER.indexOf(key);
  const sectionOrder = [...DEFAULT_SECTION_ORDER].sort((a, b) => rank(a) - rank(b));

  const visible = (key: string) => sectionMap[key]?.visible !== false;

  const [
    projects,
    skillCategories,
    experiences,
    education,
    certificates,
    research,
    achievements,
  ] = await Promise.all([
    getFeaturedProjects(6),
    getSkills(),
    getExperience(),
    getEducation(),
    getCertificates(),
    getResearch(),
    getAchievements(),
  ]);

  const marqueeSkills = skillCategories
    .flatMap((c) => c.skills)
    .slice(0, 12)
    .map((s) => s.name);

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return visible("hero") && hero ? <HeroSection hero={hero} /> : null;
      case "marquee":
        return visible("marquee") && marqueeSkills.length > 0 ? (
          <TechMarquee items={marqueeSkills} />
        ) : null;
      case "about":
        return visible("about") && about?.content ? (
          <AboutPreview about={about} name={profile?.name} />
        ) : null;
      case "skills":
        return visible("skills") && skillCategories.length > 0 ? (
          <SkillsSection categories={skillCategories} />
        ) : null;
      case "projects":
        return visible("projects") ? (
          <section id="projects" className="scroll-mt-24">
            <div className="container-page pb-12 pt-24">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading
                  eyebrow="Featured work"
                  title="Selected Projects"
                  description="A selection of full-stack, desktop and web projects I have built."
                />
                {navItems.find((n) => n.key === "projects") ? (
                  <Reveal delay={0.1} className="mb-1">
                    <Button asChild variant="outline">
                      <Link href="/projects">
                        View all projects
                        <ArrowRight />
                      </Link>
                    </Button>
                  </Reveal>
                ) : null}
              </div>
            </div>

            {projects.length > 0 ? (
              <PinnedProjects projects={projects} />
            ) : (
              <div className="container-page pb-24">
                <SectionEmpty
                  title="No projects yet"
                  description="Projects I build will be showcased here."
                />
              </div>
            )}
            <div className="container-page pb-24" aria-hidden />
          </section>
        ) : null;
      case "experience":
        return visible("experience") && experiences.length > 0 ? (
          <ExperienceSection experiences={experiences} />
        ) : null;
      case "education":
        return visible("education") && education.length > 0 ? (
          <section className="section-edge scroll-mt-24 py-24">
            <div className="container-page">
              <EducationSection education={education} />
            </div>
          </section>
        ) : null;
      case "research":
        return visible("research") ? (
          <ResearchSection research={research} />
        ) : null;
      case "certificates":
        return visible("certificates") ? (
          <CertificatesSection certificates={certificates} />
        ) : null;
      case "achievements":
        return visible("achievements") && achievements.length > 0 ? (
          <AchievementsSection achievements={achievements} />
        ) : null;
      case "contact":
        return visible("contact") ? (
          <ContactCta email={profile?.email} socialLinks={socialLinks} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            personSchema({ profile, siteUrl, socialLinks }),
            websiteSchema({
              name: settings.siteName || profile?.name || "Portfolio",
              siteUrl,
              description:
                profile?.seoDescription || settings.siteDescription || undefined,
            }),
          ],
        }}
      />

      {sectionOrder.map((key) => (
        <div key={key}>{renderSection(key)}</div>
      ))}
    </>
  );
}
