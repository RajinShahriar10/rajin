"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import {
  profileSchema,
  heroSchema,
  aboutSchema,
  skillSchema,
  skillCategorySchema,
  projectSchema,
  experienceSchema,
  educationSchema,
  certificateSchema,
  achievementSchema,
  researchSchema,
  socialLinkSchema,
} from "@/lib/validation";

type IdRecord = { id?: string | null; [k: string]: unknown };

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

async function syncChildren(
  incoming: IdRecord[],
  upsert: (item: IdRecord) => PromiseLike<unknown>,
  remove: (id: string) => PromiseLike<unknown>,
  currentIds: Set<string>,
) {
  for (const item of incoming) {
    await upsert(item);
  }
  for (const id of currentIds) {
    if (!incoming.some((i) => i.id === id)) {
      await remove(id);
    }
  }
}

async function associateMedia(publicIds: string[], entityType: string, entityId: string) {
  if (publicIds.length === 0) return;
  await prisma.media.updateMany({
    where: { publicId: { in: publicIds } },
    data: { entityType, entityId },
  });
}

async function associateMediaByUrl(urls: string[], entityType: string, entityId: string) {
  const valid = urls.filter(Boolean);
  if (valid.length === 0) return;
  await prisma.media.updateMany({
    where: { url: { in: valid } },
    data: { entityType, entityId },
  });
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function updateProfileAction(values: unknown) {
  await requireAdmin();
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid profile data." };
  }
  const data = parsed.data;
  await prisma.profile.upsert({
    where: { id: "main" },
    update: { ...data },
    create: { ...data, id: "main", name: data.name ?? "My Name", title: data.title ?? "" },
  });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export async function updateHeroAction(values: unknown) {
  await requireAdmin();
  const parsed = heroSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid hero data." };
  }
  const { stats = [], ...data } = parsed.data;

  const current = await prisma.hero.findUnique({
    where: { id: "main" },
    include: { stats: { select: { id: true } } },
  });

  await prisma.hero.upsert({
    where: { id: "main" },
    update: { ...data },
    create: { ...data, id: "main", headline: data.headline ?? "Hello" },
  });

  await syncChildren(
    stats,
    (item) =>
      item.id
        ? prisma.heroStat.update({
            where: { id: item.id },
            data: {
              label: item.label as string,
              value: item.value as string,
              order: item.order as number,
            },
          })
        : prisma.heroStat.create({
            data: {
              heroId: "main",
              label: item.label as string,
              value: item.value as string,
              order: item.order as number,
            },
          }),
    (id) => prisma.heroStat.delete({ where: { id } }),
    new Set((current?.stats ?? []).map((s) => s.id)),
  );

  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export async function updateAboutAction(values: unknown) {
  await requireAdmin();
  const parsed = aboutSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid about data." };
  }
  const { stats = [], principles = [], ...data } = parsed.data;

  const current = await prisma.about.findUnique({
    where: { id: "main" },
    include: {
      stats: { select: { id: true } },
      principles: { select: { id: true } },
    },
  });

  await prisma.about.upsert({
    where: { id: "main" },
    update: { ...data },
    create: { ...data, id: "main", heading: data.heading ?? "About Me" },
  });

  await syncChildren(
    stats,
    (item) =>
      item.id
        ? prisma.aboutStat.update({
            where: { id: item.id },
            data: {
              label: item.label as string,
              value: item.value as string,
              order: item.order as number,
            },
          })
        : prisma.aboutStat.create({
            data: {
              aboutId: "main",
              label: item.label as string,
              value: item.value as string,
              order: item.order as number,
            },
          }),
    (id) => prisma.aboutStat.delete({ where: { id } }),
    new Set((current?.stats ?? []).map((s) => s.id)),
  );

  await syncChildren(
    principles,
    (item) =>
      item.id
        ? prisma.aboutPrinciple.update({
            where: { id: item.id },
            data: {
              title: item.title as string,
              summary: item.summary as string,
              order: item.order as number,
            },
          })
        : prisma.aboutPrinciple.create({
            data: {
              aboutId: "main",
              title: item.title as string,
              summary: item.summary as string,
              order: item.order as number,
            },
          }),
    (id) => prisma.aboutPrinciple.delete({ where: { id } }),
    new Set((current?.principles ?? []).map((p) => p.id)),
  );

  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export async function createSkillCategoryAction(values: unknown) {
  await requireAdmin();
  const parsed = skillCategorySchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid category." };
  await prisma.skillCategory.create({ data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function updateSkillCategoryAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = skillCategorySchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid category." };
  await prisma.skillCategory.update({ where: { id }, data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function deleteSkillCategoryAction(id: string) {
  await requireAdmin();
  await prisma.skillCategory.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

export async function createSkillAction(categoryId: string, values: unknown) {
  await requireAdmin();
  const parsed = skillSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid skill." };
  await prisma.skill.create({ data: { ...parsed.data, categoryId } });
  revalidateSite();
  return { ok: true as const };
}

export async function updateSkillAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = skillSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid skill." };
  await prisma.skill.update({ where: { id }, data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function deleteSkillAction(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function createProjectAction(values: unknown) {
  await requireAdmin();
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid project data." };
  }
  const {
    technologies = [],
    images = [],
    features = [],
    metrics = [],
    challenges = [],
    solutions = [],
    ...data
  } = parsed.data;

  const project = await prisma.project.create({
    data: {
      ...data,
      technologies: { create: technologies.map((t) => ({ name: t.name, order: t.order })) },
      images: { create: images.map((i) => ({ url: i.url, publicId: i.publicId ?? null, alt: i.alt, order: i.order })) },
      features: { create: features.map((f) => ({ content: f.content, order: f.order })) },
      metrics: { create: metrics.map((m) => ({ label: m.label, value: m.value, order: m.order })) },
      challenges: { create: challenges.map((c) => ({ content: c.content, order: c.order })) },
      solutions: { create: solutions.map((s) => ({ content: s.content, order: s.order })) },
    },
    select: { id: true },
  });

  await associateMedia(images.map((i) => i.publicId).filter((x): x is string => Boolean(x)), "project", project.id);
  revalidateSite();
  return { ok: true as const };
}

export async function updateProjectAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid project data." };
  }
  const {
    technologies = [],
    images = [],
    features = [],
    metrics = [],
    challenges = [],
    solutions = [],
    ...data
  } = parsed.data;

  const current = await prisma.project.findUnique({
    where: { id },
    include: {
      technologies: { select: { id: true } },
      images: { select: { id: true } },
      features: { select: { id: true } },
      metrics: { select: { id: true } },
      challenges: { select: { id: true } },
      solutions: { select: { id: true } },
    },
  });
  if (!current) return { ok: false as const, error: "Project not found." };

  await prisma.project.update({ where: { id }, data });

  await syncChildren(
    technologies,
    (item) =>
      item.id
        ? prisma.projectTechnology.update({ where: { id: item.id }, data: { name: item.name as string, order: item.order as number } })
        : prisma.projectTechnology.create({ data: { projectId: id, name: item.name as string, order: item.order as number } }),
    (cid) => prisma.projectTechnology.delete({ where: { id: cid } }),
    new Set(current.technologies.map((t) => t.id)),
  );
  await syncChildren(
    images,
    (item) =>
      item.id
        ? prisma.projectImage.update({ where: { id: item.id }, data: { url: item.url as string, publicId: (item.publicId as string | undefined) ?? null, alt: item.alt as string | undefined, order: item.order as number } })
        : prisma.projectImage.create({ data: { projectId: id, url: item.url as string, publicId: (item.publicId as string | undefined) ?? null, alt: item.alt as string | undefined, order: item.order as number } }),
    (cid) => prisma.projectImage.delete({ where: { id: cid } }),
    new Set(current.images.map((t) => t.id)),
  );

  await associateMedia(images.map((i) => i.publicId).filter((x): x is string => Boolean(x)), "project", id);
  await syncChildren(
    features,
    (item) =>
      item.id
        ? prisma.projectFeature.update({ where: { id: item.id }, data: { content: item.content as string, order: item.order as number } })
        : prisma.projectFeature.create({ data: { projectId: id, content: item.content as string, order: item.order as number } }),
    (cid) => prisma.projectFeature.delete({ where: { id: cid } }),
    new Set(current.features.map((t) => t.id)),
  );
  await syncChildren(
    metrics,
    (item) =>
      item.id
        ? prisma.projectMetric.update({ where: { id: item.id }, data: { label: item.label as string, value: item.value as string, order: item.order as number } })
        : prisma.projectMetric.create({ data: { projectId: id, label: item.label as string, value: item.value as string, order: item.order as number } }),
    (cid) => prisma.projectMetric.delete({ where: { id: cid } }),
    new Set(current.metrics.map((t) => t.id)),
  );
  await syncChildren(
    challenges,
    (item) =>
      item.id
        ? prisma.projectChallenge.update({ where: { id: item.id }, data: { content: item.content as string, order: item.order as number } })
        : prisma.projectChallenge.create({ data: { projectId: id, content: item.content as string, order: item.order as number } }),
    (cid) => prisma.projectChallenge.delete({ where: { id: cid } }),
    new Set(current.challenges.map((t) => t.id)),
  );
  await syncChildren(
    solutions,
    (item) =>
      item.id
        ? prisma.projectSolution.update({ where: { id: item.id }, data: { content: item.content as string, order: item.order as number } })
        : prisma.projectSolution.create({ data: { projectId: id, content: item.content as string, order: item.order as number } }),
    (cid) => prisma.projectSolution.delete({ where: { id: cid } }),
    new Set(current.solutions.map((t) => t.id)),
  );

  revalidateSite();
  return { ok: true as const };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export async function createExperienceAction(values: unknown) {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid experience." };
  await prisma.experience.create({ data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function updateExperienceAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid experience." };
  await prisma.experience.update({ where: { id }, data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export async function createEducationAction(values: unknown) {
  await requireAdmin();
  const parsed = educationSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid education." };
  await prisma.education.create({ data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function updateEducationAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = educationSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid education." };
  await prisma.education.update({ where: { id }, data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function deleteEducationAction(id: string) {
  await requireAdmin();
  await prisma.education.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------

export async function createCertificateAction(values: unknown) {
  await requireAdmin();
  const parsed = certificateSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid certificate." };
  const cert = await prisma.certificate.create({ data: parsed.data, select: { id: true } });
  if (parsed.data.imageUrl) {
    await associateMediaByUrl([parsed.data.imageUrl], "certificate", cert.id);
  }
  revalidateSite();
  return { ok: true as const };
}

export async function updateCertificateAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = certificateSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid certificate." };
  await prisma.certificate.update({ where: { id }, data: parsed.data });
  if (parsed.data.imageUrl) {
    await associateMediaByUrl([parsed.data.imageUrl], "certificate", id);
  }
  revalidateSite();
  return { ok: true as const };
}

export async function deleteCertificateAction(id: string) {
  await requireAdmin();
  await prisma.certificate.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export async function createAchievementAction(values: unknown) {
  await requireAdmin();
  const parsed = achievementSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid achievement." };
  const achievement = await prisma.achievement.create({
    data: parsed.data,
    select: { id: true },
  });
  if (parsed.data.imageUrl) {
    await associateMediaByUrl([parsed.data.imageUrl], "achievement", achievement.id);
  }
  revalidateSite();
  return { ok: true as const };
}

export async function updateAchievementAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = achievementSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid achievement." };
  await prisma.achievement.update({ where: { id }, data: parsed.data });
  if (parsed.data.imageUrl) {
    await associateMediaByUrl([parsed.data.imageUrl], "achievement", id);
  }
  revalidateSite();
  return { ok: true as const };
}

export async function deleteAchievementAction(id: string) {
  await requireAdmin();
  await prisma.achievement.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------

export async function createResearchAction(values: unknown) {
  await requireAdmin();
  const parsed = researchSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid research entry." };
  const { tags = [], ...data } = parsed.data;
  const research = await prisma.research.create({
    data: {
      ...data,
      tags: { create: tags.map((t) => ({ name: t.name, order: t.order })) },
    },
    select: { id: true },
  });
  if (data.imageUrl) {
    await associateMediaByUrl([data.imageUrl], "research", research.id);
  }
  revalidateSite();
  return { ok: true as const };
}

export async function updateResearchAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = researchSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid research entry." };
  const { tags = [], ...data } = parsed.data;

  const current = await prisma.research.findUnique({
    where: { id },
    include: { tags: { select: { id: true } } },
  });
  if (!current) return { ok: false as const, error: "Research entry not found." };

  await prisma.research.update({ where: { id }, data });
  if (data.imageUrl) {
    await associateMediaByUrl([data.imageUrl], "research", id);
  }
  await syncChildren(
    tags,
    (item) =>
      item.id
        ? prisma.researchTag.update({ where: { id: item.id }, data: { name: item.name as string, order: item.order as number } })
        : prisma.researchTag.create({ data: { researchId: id, name: item.name as string, order: item.order as number } }),
    (tid) => prisma.researchTag.delete({ where: { id: tid } }),
    new Set(current.tags.map((t) => t.id)),
  );

  revalidateSite();
  return { ok: true as const };
}

export async function deleteResearchAction(id: string) {
  await requireAdmin();
  await prisma.research.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Social links
// ---------------------------------------------------------------------------

export async function createSocialLinkAction(values: unknown) {
  await requireAdmin();
  const parsed = socialLinkSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid social link." };
  await prisma.socialLink.create({ data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function updateSocialLinkAction(id: string, values: unknown) {
  await requireAdmin();
  const parsed = socialLinkSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: "Invalid social link." };
  await prisma.socialLink.update({ where: { id }, data: parsed.data });
  revalidateSite();
  return { ok: true as const };
}

export async function deleteSocialLinkAction(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Settings & sections
// ---------------------------------------------------------------------------

export async function updateSettingsAction(settings: Array<{ key: string; value: string }>) {
  await requireAdmin();
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  revalidateSite();
  return { ok: true as const };
}

export async function updateSectionsAction(
  sections: Array<{ key: string; visible: boolean; order: number }>,
) {
  await requireAdmin();
  for (const s of sections) {
    await prisma.sectionSetting.update({ where: { key: s.key }, data: s });
  }
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidateSite();
  return { ok: true as const };
}

export async function toggleMessageReadAction(id: string, read: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidateSite();
  return { ok: true as const };
}

export async function setMessageArchivedAction(id: string, archived: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { archived } });
  revalidateSite();
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

export async function changePasswordAction(values: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const session = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: session.user!.id } });
  if (!user) return { ok: false as const, error: "User not found." };

  const valid = await bcrypt.compare(values.currentPassword, user.passwordHash);
  if (!valid) return { ok: false as const, error: "Current password is incorrect." };
  if (values.newPassword.length < 8) {
    return { ok: false as const, error: "New password must be at least 8 characters." };
  }
  if (values.newPassword !== values.confirmPassword) {
    return { ok: false as const, error: "Passwords do not match." };
  }

  const passwordHash = await bcrypt.hash(values.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return { ok: true as const };
}
