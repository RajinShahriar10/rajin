import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/data/site";
import { getProjectSlugs } from "@/lib/data/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();
  const slugs = await getProjectSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    { url: `${siteUrl}/projects`, lastModified: new Date() },
    { url: `${siteUrl}/experience`, lastModified: new Date() },
    { url: `${siteUrl}/research`, lastModified: new Date() },
    { url: `${siteUrl}/certificates`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
  ];

  const projectRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/projects/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
