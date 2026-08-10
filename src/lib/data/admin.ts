import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type DashboardStats = {
  projects: number;
  featured: number;
  published: number;
  skills: number;
  certificates: number;
  research: number;
  achievements: number;
  messages: number;
  unread: number;
};

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  const [projects, featured, published, skills, certificates, research, achievements, messages, unread] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.project.count({ where: { published: true } }),
      prisma.skill.count(),
      prisma.certificate.count(),
      prisma.research.count(),
      prisma.achievement.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  return {
    projects,
    featured,
    published,
    skills,
    certificates,
    research,
    achievements,
    messages,
    unread,
  };
});

export type ActivityItem = {
  id: string;
  type: string;
  label: string;
  detail: string | null;
  href: string;
  at: Date;
  action: "created" | "updated";
};

const created = (at: Date, createdAt: Date): "created" | "updated" =>
  at.getTime() - createdAt.getTime() < 1500 ? "created" : "updated";

export const getRecentActivity = cache(
  async (limit = 12): Promise<ActivityItem[]> => {
    const take = limit;

    const [projects, experiences, education, certificates, achievements, research, skills, messages, media] =
      await Promise.all([
        prisma.project.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, title: true, updatedAt: true, createdAt: true },
        }),
        prisma.experience.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, role: true, company: true, updatedAt: true, createdAt: true },
        }),
        prisma.education.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, degree: true, institution: true, updatedAt: true, createdAt: true },
        }),
        prisma.certificate.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, title: true, issuer: true, updatedAt: true, createdAt: true },
        }),
        prisma.achievement.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, title: true, updatedAt: true, createdAt: true },
        }),
        prisma.research.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, title: true, category: true, updatedAt: true, createdAt: true },
        }),
        prisma.skill.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, name: true, categoryId: true, updatedAt: true, createdAt: true },
        }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take,
          select: { id: true, name: true, subject: true, createdAt: true, updatedAt: true },
        }),
        prisma.media.findMany({
          orderBy: { updatedAt: "desc" },
          take,
          select: { id: true, publicId: true, updatedAt: true, createdAt: true },
        }),
      ]);

    const items: ActivityItem[] = [
      ...projects.map((p) => ({
        id: p.id,
        type: "project",
        label: p.title,
        detail: null,
        href: `/admin/projects/${p.id}`,
        at: p.updatedAt,
        action: created(p.updatedAt, p.createdAt),
      })),
      ...experiences.map((e) => ({
        id: e.id,
        type: "experience",
        label: `${e.role} · ${e.company}`,
        detail: null,
        href: `/admin/experience/${e.id}`,
        at: e.updatedAt,
        action: created(e.updatedAt, e.createdAt),
      })),
      ...education.map((ed) => ({
        id: ed.id,
        type: "education",
        label: `${ed.degree} · ${ed.institution}`,
        detail: null,
        href: `/admin/education/${ed.id}`,
        at: ed.updatedAt,
        action: created(ed.updatedAt, ed.createdAt),
      })),
      ...certificates.map((c) => ({
        id: c.id,
        type: "certificate",
        label: c.title,
        detail: c.issuer ?? null,
        href: `/admin/certificates/${c.id}`,
        at: c.updatedAt,
        action: created(c.updatedAt, c.createdAt),
      })),
      ...achievements.map((a) => ({
        id: a.id,
        type: "achievement",
        label: a.title,
        detail: null,
        href: `/admin/achievements/${a.id}`,
        at: a.updatedAt,
        action: created(a.updatedAt, a.createdAt),
      })),
      ...research.map((r) => ({
        id: r.id,
        type: "research",
        label: r.title,
        detail: r.category ?? null,
        href: `/admin/research/${r.id}`,
        at: r.updatedAt,
        action: created(r.updatedAt, r.createdAt),
      })),
      ...skills.map((s) => ({
        id: s.id,
        type: "skill",
        label: s.name,
        detail: null,
        href: `/admin/skills`,
        at: s.updatedAt,
        action: created(s.updatedAt, s.createdAt),
      })),
      ...messages.map((m) => ({
        id: m.id,
        type: "message",
        label: m.subject ?? `Message from ${m.name}`,
        detail: m.name,
        href: `/admin/messages`,
        at: m.createdAt,
        action: "created" as const,
      })),
      ...media.map((md) => ({
        id: md.id,
        type: "media",
        label: md.publicId,
        detail: null,
        href: `/admin/media`,
        at: md.updatedAt,
        action: created(md.updatedAt, md.createdAt),
      })),
    ];

    return items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit);
  },
);

export const getRecentMessages = cache(async (limit = 5) => {
  return prisma.contactMessage.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      subject: true,
      read: true,
      createdAt: true,
    },
  });
});
