import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSiteData = cache(async () => {
  const [profile, hero, about, settings, sections, socialLinks] =
    await Promise.all([
      prisma.profile.findUnique({ where: { id: "main" } }),
      prisma.hero.findUnique({
        where: { id: "main" },
        include: { stats: { orderBy: { order: "asc" } } },
      }),
      prisma.about.findUnique({
        where: { id: "main" },
        include: {
          stats: { orderBy: { order: "asc" } },
          principles: { orderBy: { order: "asc" } },
        },
      }),
      prisma.siteSetting.findMany(),
      prisma.sectionSetting.findMany({ orderBy: { order: "asc" } }),
      prisma.socialLink.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
      }),
    ]);

  const settingsMap = Object.fromEntries(
    settings.map((s) => [s.key, s.value]),
  );
  const sectionMap = Object.fromEntries(
    sections.map((s) => [s.key, s]),
  );

  return { profile, hero, about, settings: settingsMap, sections, sectionMap, socialLinks };
});

export const getSiteUrl = cache(async () => {
  const { settings } = await getSiteData();
  const fromSetting = settings.siteUrl?.trim();
  if (fromSetting) return fromSetting.replace(/\/$/, "");
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
});

/**
 * Nav-worthy homepage sections and the site setting that overrides their label.
 * Order follows the homepage `SectionSetting` order, mirroring the rendered page.
 */
const NAV_LABEL_KEYS: Record<string, string> = {
  about: "navAbout",
  skills: "navSkills",
  projects: "navProjects",
  experience: "navExperience",
  education: "navEducation",
  research: "navResearch",
  certificates: "navCertificates",
  achievements: "navAchievements",
  contact: "navContact",
};

export const getNavItems = cache(async () => {
  const { settings, sections, sectionMap } = await getSiteData();
  const items: Array<{ label: string; href: string; key: string }> = [];
  for (const section of sections) {
    const labelKey = NAV_LABEL_KEYS[section.key];
    if (!labelKey) continue;
    if (sectionMap[section.key] && !sectionMap[section.key].visible) continue;
    items.push({
      key: section.key,
      label: settings[labelKey] || section.label || section.key,
      href: `/#${section.key}`,
    });
  }
  return items;
});
