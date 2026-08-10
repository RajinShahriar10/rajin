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

export const getNavItems = cache(async () => {
  const { settings, sectionMap } = await getSiteData();
  const items: Array<{ label: string; href: string; key: string }> = [];
  const defs: Array<{ key: string; labelKey: string; href: string }> = [
    { key: "about", labelKey: "navAbout", href: "/about" },
    { key: "projects", labelKey: "navProjects", href: "/projects" },
    { key: "experience", labelKey: "navExperience", href: "/experience" },
    { key: "research", labelKey: "navResearch", href: "/research" },
    { key: "certificates", labelKey: "navCertificates", href: "/certificates" },
    { key: "contact", labelKey: "navContact", href: "/contact" },
  ];
  for (const def of defs) {
    const section = sectionMap[def.key];
    if (section && !section.visible) continue;
    items.push({
      key: def.key,
      label: settings[def.labelKey] || def.key,
      href: def.href,
    });
  }
  return items;
});
