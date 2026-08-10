export const SITE_NAME_DEFAULT = "MD. Rajin Shahriar";

export const SECTION_KEYS = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "research",
  "certificates",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const ADMIN_SECTION_PATHS: Record<SectionKey, string> = {
  hero: "/admin/hero",
  about: "/admin/about",
  skills: "/admin/skills",
  projects: "/admin/projects",
  experience: "/admin/experience",
  education: "/admin/education",
  research: "/admin/research",
  certificates: "/admin/certificates",
  contact: "/admin/settings",
};

export const PROJECT_STATUSES = [
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "archived", label: "Archived" },
] as const;

export const PROJECT_CATEGORIES = [
  "Full-Stack Web",
  "Web",
  "Desktop Application",
  "Mobile",
  "Backend / API",
  "Open Source",
] as const;

export const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "x",
  "facebook",
  "instagram",
  "youtube",
  "dribbble",
  "behance",
  "email",
  "website",
  "other",
] as const;

export const SECTION_SETTING_DESCRIPTIONS: Record<string, string> = {
  hero: "Homepage hero section.",
  about: "About section and /about page.",
  skills: "Skills section on the homepage.",
  projects: "Featured project carousel + /projects pages.",
  experience: "Experience timeline section.",
  education: "Education timeline section.",
  research: "Research section and /research page.",
  certificates: "Certificates section and /certificates page.",
  contact: "Contact section and /contact page.",
};
