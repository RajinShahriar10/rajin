import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type ProjectListItem = Awaited<ReturnType<typeof getProjects>>[number];

export const getProjects = cache(async () => {
  return prisma.project.findMany({
    where: { published: true },
    include: {
      technologies: { orderBy: { order: "asc" }, select: { id: true, name: true } },
    },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
});

export const getFeaturedProjects = cache(async () => {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    include: {
      technologies: { orderBy: { order: "asc" }, select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  });
});

export const getProjectBySlug = cache(async (slug: string) => {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      images: { orderBy: { order: "asc" } },
      technologies: { orderBy: { order: "asc" } },
      features: { orderBy: { order: "asc" } },
      metrics: { orderBy: { order: "asc" } },
      challenges: { orderBy: { order: "asc" } },
      solutions: { orderBy: { order: "asc" } },
    },
  });
});

export const getProjectSlugs = cache(async () => {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((p) => p.slug);
});

export const getRelatedProjects = cache(async (slug: string) => {
  const current = await prisma.project.findFirst({
    where: { slug, published: true },
    select: { id: true, category: true },
  });
  if (!current) return [];
  return prisma.project.findMany({
    where: {
      published: true,
      id: { not: current.id },
      ...(current.category ? { category: current.category } : {}),
    },
    include: {
      technologies: { orderBy: { order: "asc" }, select: { id: true, name: true } },
    },
    take: 3,
    orderBy: { order: "asc" },
  });
});

export const getAdjacentProjects = cache(async (slug: string) => {
  const all = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true, title: true, category: true, primaryImageUrl: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: all[index - 1] ?? null,
    next: all[index + 1] ?? null,
  };
});
