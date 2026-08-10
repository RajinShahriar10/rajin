import type { Profile, SocialLink } from "@prisma/client";

type PersonInput = {
  profile: Pick<
    Profile,
    | "name"
    | "title"
    | "email"
    | "location"
    | "website"
    | "profileImageUrl"
  > | null;
  siteUrl: string;
  socialLinks: Array<Pick<SocialLink, "platform" | "url">>;
};

/** https://schema.org/Person — the site owner. */
export function personSchema({ profile, siteUrl, socialLinks }: PersonInput) {
  const sameAs = socialLinks
    .filter((link) => !["email", "website"].includes(link.platform))
    .map((link) => link.url);

  return {
    "@type": "Person",
    name: profile?.name,
    jobTitle: profile?.title ?? undefined,
    url: siteUrl,
    image: profile?.profileImageUrl ?? undefined,
    email: profile?.email ?? undefined,
    ...(profile?.location ? { homeLocation: profile.location } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(profile?.website ? { website: profile.website } : {}),
  };
}

/** https://schema.org/WebSite — the portfolio itself. */
export function websiteSchema({
  name,
  siteUrl,
  description,
}: {
  name: string;
  siteUrl: string;
  description?: string;
}) {
  return {
    "@type": "WebSite",
    name,
    url: siteUrl,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/projects?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

type CreativeWorkInput = {
  project: {
    title: string;
    shortDescription: string | null;
    description: string | null;
    category: string | null;
    primaryImageUrl: string | null;
    completionDate: Date | null;
    startDate: Date | null;
    slug: string;
    liveUrl: string | null;
    githubUrl: string | null;
    technologies: Array<{ name: string }>;
  };
  siteUrl: string;
  authorName: string;
  authorUrl: string;
};

/**
 * https://schema.org/CreativeWork — emitted on project case-study pages.
 */
export function creativeWorkSchema({
  project,
  siteUrl,
  authorName,
  authorUrl,
}: CreativeWorkInput) {
  return {
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description:
      project.shortDescription ?? project.description ?? undefined,
    url: `${siteUrl}/projects/${project.slug}`,
    image: project.primaryImageUrl ?? undefined,
    genre: project.category ?? undefined,
    keywords:
      project.technologies.length > 0
        ? project.technologies.map((t) => t.name).join(", ")
        : undefined,
    datePublished: project.completionDate ?? project.startDate ?? undefined,
    ...(project.liveUrl ? { url_related: project.liveUrl } : {}),
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
  };
}
