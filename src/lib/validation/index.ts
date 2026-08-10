import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const optionalString = (max = 10000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const optionalUrl = z
  .union([z.literal(""), z.string().url()])
  .optional()
  .transform((v) => (v ? v : undefined));

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  title: z.string().trim().min(1, "Professional title is required").max(160),
  tagline: optionalString(240),
  summary: optionalString(),
  bio: optionalString(),
  profileImageUrl: optionalUrl,
  profileImageAlt: optionalString(200),
  resumeUrl: optionalUrl,
  email: z.union([z.literal(""), z.string().email()]).optional().transform((v) => (v ? v : undefined)),
  phone: optionalString(60),
  location: optionalString(160),
  website: optionalUrl,
  availability: optionalString(160),
  seoTitle: optionalString(120),
  seoDescription: optionalString(320),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const heroSchema = z.object({
  eyebrow: optionalString(120),
  headline: z.string().trim().min(1, "Headline is required").max(200),
  subheadline: optionalString(300),
  description: optionalString(),
  primaryCtaLabel: optionalString(60),
  primaryCtaHref: optionalString(300),
  secondaryCtaLabel: optionalString(60),
  secondaryCtaHref: optionalString(300),
  profileImageUrl: optionalUrl,
  profileImageAlt: optionalString(200),
  background: z
    .enum(["particles", "grid", "none"])
    .default("grid"),
  stats: z.array(z.object({ id: optionalString(), label: z.string().trim().min(1), value: z.string().trim().min(1), order: z.number().int().default(0) })).default([]),
});

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export const aboutSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  content: optionalString(),
  imageUrl: optionalUrl,
  imageAlt: optionalString(200),
  resumeUrl: optionalUrl,
  stats: z.array(z.object({ id: optionalString(), label: z.string().trim().min(1), value: z.string().trim().min(1), order: z.number().int().default(0) })).default([]),
  principles: z.array(z.object({ id: optionalString(), title: z.string().trim().min(1).max(120), summary: z.string().trim().min(1).max(500), order: z.number().int().default(0) })).default([]),
});

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(80),
  level: z.union([z.coerce.number().int().min(0).max(100), z.literal("")]).transform((v) => (v === "" ? null : Number(v))).nullable().optional(),
  highlight: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

export const skillCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: optionalString(),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const listItem = z.object({
  id: optionalString(),
  content: z.string().trim().min(1).max(1000),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  shortDescription: optionalString(300),
  description: optionalString(),
  category: optionalString(100),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  status: optionalString(40),
  startDate: z.union([z.coerce.date(), z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  completionDate: z.union([z.coerce.date(), z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  primaryImageUrl: optionalUrl,
  primaryImageAlt: optionalString(200),
  videoUrl: optionalUrl,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  documentationUrl: optionalUrl,
  role: optionalString(120),
  teamSize: z.union([z.coerce.number().int().min(1), z.literal("")]).transform((v) => (v === "" ? null : Number(v))).nullable().optional(),
  architecture: optionalString(),
  databaseInfo: optionalString(),
  order: z.coerce.number().int().default(0),
  seoTitle: optionalString(120),
  seoDescription: optionalString(320),
  technologies: z.array(z.object({ id: optionalString(), name: z.string().trim().min(1).max(80), order: z.number().int().default(0) })).default([]),
  images: z.array(z.object({ id: optionalString(), url: z.string().trim().min(1), publicId: optionalString(200), alt: optionalString(200), order: z.number().int().default(0) })).default([]),
  features: z.array(listItem).default([]),
  metrics: z.array(z.object({ id: optionalString(), label: z.string().trim().min(1), value: z.string().trim().min(1), order: z.number().int().default(0) })).default([]),
  challenges: z.array(listItem).default([]),
  solutions: z.array(listItem).default([]),
});

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export const experienceSchema = z.object({
  role: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  location: optionalString(160),
  startDate: z.union([z.coerce.date(), z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  endDate: z.union([z.coerce.date(), z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  current: z.boolean().default(false),
  description: optionalString(),
  technologies: optionalString(500),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export const educationSchema = z.object({
  degree: z.string().trim().min(1).max(200),
  institution: z.string().trim().min(1).max(200),
  location: optionalString(160),
  startYear: optionalString(20),
  endYear: optionalString(20),
  current: z.boolean().default(false),
  score: optionalString(80),
  description: optionalString(),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Certificates / Achievements / Research
// ---------------------------------------------------------------------------

export const certificateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(200),
  issueDate: z.union([z.coerce.date(), z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  credentialId: optionalString(200),
  url: optionalUrl,
  imageUrl: optionalUrl,
  imageAlt: optionalString(200),
  description: optionalString(),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

export const achievementSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: optionalString(),
  date: z.union([z.coerce.date(), z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  category: optionalString(100),
  imageUrl: optionalUrl,
  imageAlt: optionalString(200),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

export const researchSchema = z.object({
  title: z.string().trim().min(1).max(200),
  category: optionalString(100),
  authorPosition: optionalString(120),
  conference: optionalString(200),
  institution: optionalString(200),
  imageUrl: optionalUrl,
  imageAlt: optionalString(200),
  summary: optionalString(),
  details: optionalString(),
  url: optionalUrl,
  date: z.union([z.coerce.date(), z.literal("")]).transform((v) => (v === "" ? null : v)).nullable().optional(),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
  tags: z.array(z.object({ id: optionalString(), name: z.string().trim().min(1).max(60), order: z.number().int().default(0) })).default([]),
});

// ---------------------------------------------------------------------------
// Social / Settings / Messages
// ---------------------------------------------------------------------------

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1).max(40),
  url: z.string().url("Enter a valid URL"),
  label: optionalString(80),
  order: z.coerce.number().int().default(0),
  visible: z.boolean().default(true),
});

export const sectionSettingsSchema = z.array(
  z.object({
    key: z.string().min(1),
    visible: z.boolean(),
    order: z.coerce.number().int(),
  }),
);

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  subject: optionalString(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});
