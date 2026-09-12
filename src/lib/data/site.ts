import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSiteData = cache(async () => {
  // Queries run one at a time to keep concurrent load on the pooled Neon
  // connection low during static-generation bursts (P2024 pool timeouts).
  const profile = await prisma.profile.findUnique({ where: { id: "main" } });
  const hero = await prisma.hero.findUnique({
    where: { id: "main" },
    include: { stats: { orderBy: { order: "asc" } } },
  });
  const about = await prisma.about.findUnique({
    where: { id: "main" },
    include: {
      stats: { orderBy: { order: "asc" } },
      principles: { orderBy: { order: "asc" } },
    },
  });
  const settings = await prisma.siteSetting.findMany();
  const sections = await prisma.sectionSetting.findMany({
    orderBy: { order: "asc" },
  });
  const socialLinks = await prisma.socialLink.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });

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
