import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs, getRelatedProjects, getAdjacentProjects } from "@/lib/data/projects";
import { getSiteData, getSiteUrl } from "@/lib/data/site";
import { buildMetadata, socialImage } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";
import { creativeWorkSchema } from "@/lib/json-ld";
import { ProjectDetail } from "@/components/public/projects/project-detail";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ path: "/projects" });

  const { profile } = await getSiteData();
  const siteUrl = await getSiteUrl();
  const siteName = profile?.name ?? "Portfolio";

  const title = project.seoTitle || project.title;
  const description =
    project.seoDescription ||
    project.shortDescription ||
    `Project case study for ${project.title}`;
  const url = `${siteUrl}/projects/${project.slug}`;
  const ogImage = socialImage(project.primaryImageUrl);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: title.slice(0, 70),
      description: description.slice(0, 200),
      url,
      siteName,
      type: "article",
      locale: "en_US",
      ...(project.completionDate
        ? { publishedTime: project.completionDate.toISOString() }
        : {}),
      ...(project.updatedAt
        ? { modifiedTime: project.updatedAt.toISOString() }
        : {}),
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: project.primaryImageAlt || project.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title.slice(0, 70),
      description: description.slice(0, 200),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [related, { prev, next }, { profile }, siteUrl] = await Promise.all([
    getRelatedProjects(slug),
    getAdjacentProjects(slug),
    getSiteData(),
    getSiteUrl(),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...creativeWorkSchema({
            project,
            siteUrl,
            authorName: profile?.name || "Portfolio",
            authorUrl: siteUrl,
          }),
        }}
      />
      <ProjectDetail project={project} related={related} prev={prev} next={next} />
    </>
  );
}
