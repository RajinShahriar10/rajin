import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSkills = cache(async () => {
  const categories = await prisma.skillCategory.findMany({
    where: { visible: true },
    include: {
      skills: {
        where: { visible: true },
        orderBy: { order: "asc" },
        select: { id: true, name: true, level: true, highlight: true },
      },
    },
    orderBy: { order: "asc" },
  });
  return categories.filter((c) => c.skills.length > 0);
});

export const getExperience = cache(async () => {
  return prisma.experience.findMany({
    where: { visible: true },
    orderBy: [{ current: "desc" }, { startDate: "desc" }],
  });
});

export const getEducation = cache(async () => {
  return prisma.education.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
});

export const getCertificates = cache(async () => {
  return prisma.certificate.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
});

export const getAchievements = cache(async () => {
  return prisma.achievement.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
});

export const getResearch = cache(async () => {
  return prisma.research.findMany({
    where: { visible: true },
    include: { tags: { orderBy: { order: "asc" }, select: { id: true, name: true } } },
    orderBy: { order: "asc" },
  });
});

export const getUnreadMessageCount = cache(async () => {
  return prisma.contactMessage.count({ where: { read: false } });
});
