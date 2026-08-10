import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getHomeProjects = cache(async () => {
  return prisma.project.findMany({
    where: { published: true },
    include: { technologies: { orderBy: { order: "asc" } } },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
});

export const getFeaturedProjects = cache(async (limit = 4) => {
  return prisma.project.findMany({
    where: { published: true },
    include: { technologies: { orderBy: { order: "asc" } } },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    take: limit,
  });
});
