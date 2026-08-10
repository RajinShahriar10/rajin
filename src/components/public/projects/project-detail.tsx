import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { formatDate, cn } from "@/lib/utils";
import { Markdown } from "@/components/shared/markdown";
import { Reveal } from "@/components/shared/reveal";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { parseStat } from "@/lib/stats";
import { Button } from "@/components/ui/button";
import { ProjectCard, type ProjectCardData } from "@/components/public/projects/project-card";
import { ProjectPagination } from "@/components/public/projects/project-pagination";
import { ProjectHeroMedia } from "@/components/public/projects/project-hero-media";

// Split below-the-fold case-study sections into their own chunks so the
// initial route payload stays small.
const ProjectGallery = dynamic(() =>
  import("@/components/public/projects/project-gallery").then((m) => m.ProjectGallery),
);
const ArchitectureFlow = dynamic(() =>
  import("@/components/public/projects/architecture-flow").then((m) => m.ArchitectureFlow),
);

type AdjacentProject = {
  slug: string;
  title: string;
  category?: string | null;
};

type ProjectDetail = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  category?: string | null;
  status?: string | null;
  startDate?: Date | null;
  completionDate?: Date | null;
  primaryImageUrl?: string | null;
  primaryImageAlt?: string | null;
  videoUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  documentationUrl?: string | null;
  role?: string | null;
  teamSize?: number | null;
  architecture?: string | null;
  databaseInfo?: string | null;
  technologies: Array<{ id: string; name: string }>;
  images: Array<{ id: string; url: string; alt?: string | null }>;
  features: Array<{ id: string; content: string }>;
  metrics: Array<{ id: string; label: string; value: string }>;
  challenges: Array<{ id: string; content: string }>;
  solutions: Array<{ id: string; content: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  archived: "Archived",
};

function CaseSection({
  index,
  title,
  wide,
  children,
}: {
  index: number;
  title: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={cn(!wide && "max-w-3xl")}>
      <div className="flex items-baseline gap-3">
        <span className="tech-label shrink-0 text-primary/70">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h2>
      </div>
      <Reveal className="mt-6">{children}</Reveal>
    </section>
  );
}

export function ProjectDetail({
  project,
  related,
  prev,
  next,
}: {
  project: ProjectDetail;
  related: ProjectCardData[];
  prev?: AdjacentProject | null;
  next?: AdjacentProject | null;
}) {
  const links = [
    project.liveUrl ? { label: "Live site", href: project.liveUrl } : null,
    project.githubUrl ? { label: "Source code", href: project.githubUrl } : null,
    project.documentationUrl
      ? { label: "Documentation", href: project.documentationUrl }
      : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  const statusLabel = project.status ? STATUS_LABELS[project.status] : undefined;

  const started = project.startDate ? formatDate(project.startDate) : null;
  const completed = project.completionDate ? formatDate(project.completionDate) : null;
  const timeline = [started, completed].filter(Boolean).join(" → ") || undefined;

  const statBlocks = [
    project.role ? { label: "Role", value: project.role } : null,
    project.teamSize ? { label: "Team size", value: String(project.teamSize) } : null,
    timeline ? { label: "Timeline", value: timeline } : null,
    statusLabel ? { label: "Status", value: statusLabel } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  // Build the case-study sections top-to-bottom, numbering only the ones with content.
  const sections: Array<{
    key: string;
    title: string;
    wide?: boolean;
    node: ReactNode;
  }> = [];

  if (project.description) {
    sections.push({
      key: "overview",
      title: "Overview",
      node: <Markdown content={project.description} />,
    });
  }

  if (project.metrics.length > 0) {
    sections.push({
      key: "metrics",
      title: "Key metrics",
      wide: true,
      node: (
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {project.metrics.map((metric) => {
            const parsed = parseStat(metric.value);
            return (
              <div key={metric.id} className="flex flex-col gap-2 bg-card px-6 py-6">
                <dd className="font-display text-3xl font-semibold text-primary sm:text-4xl">
                  {parsed.number !== null ? (
                    <AnimatedNumber
                      value={parsed.number}
                      prefix={parsed.prefix}
                      suffix={parsed.suffix}
                      duration={1.8}
                    />
                  ) : (
                    parsed.text
                  )}
                </dd>
                <dt className="text-sm text-muted-foreground">{metric.label}</dt>
              </div>
            );
          })}
        </div>
      ),
    });
  }

  if (project.challenges.length > 0) {
    sections.push({
      key: "challenge",
      title: "The challenge",
      node: (
        <ul className="space-y-3">
          {project.challenges.map((challenge) => (
            <li
              key={challenge.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/70" />
              {challenge.content}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (project.solutions.length > 0) {
    sections.push({
      key: "solution",
      title: "The solution",
      node: (
        <ul className="space-y-3">
          {project.solutions.map((solution) => (
            <li
              key={solution.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground/90"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {solution.content}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (project.features.length > 0) {
    sections.push({
      key: "features",
      title: "Capabilities",
      wide: true,
      node: (
        <ul className="grid gap-3 sm:grid-cols-2">
          {project.features.map((feature) => (
            <li
              key={feature.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm text-foreground/90"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {feature.content}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (project.architecture) {
    const lines = project.architecture
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-*#>\s]+/, "").replace(/\*\*/g, "").trim())
      .filter(Boolean);
    const isFlow = lines.length >= 2 && lines.every((line) => line.length <= 48);
    sections.push({
      key: "architecture",
      title: "System architecture",
      wide: true,
      node: isFlow ? (
        <ArchitectureFlow layers={lines} />
      ) : (
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <Markdown content={project.architecture} />
        </div>
      ),
    });
  }

  if (project.databaseInfo) {
    sections.push({
      key: "database",
      title: "Data & storage",
      node: (
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <Markdown content={project.databaseInfo} />
        </div>
      ),
    });
  }

  if (project.images.length > 0) {
    sections.push({
      key: "gallery",
      title: "Visual walkthrough",
      wide: true,
      node: <ProjectGallery images={project.images} projectTitle={project.title} />,
    });
  }

  const showFacts = statBlocks.length > 0 || project.technologies.length > 0;

  return (
    <article className="container-page pb-24 pt-10">
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>
      </Reveal>

      {/* Hero */}
      <header className="mt-8">
        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center gap-3">
            {project.category ? <span className="tech-label">{project.category}</span> : null}
            {statusLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
                {statusLabel}
              </span>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
        </Reveal>

        {project.shortDescription ? (
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {project.shortDescription}
            </p>
          </Reveal>
        ) : null}

        {links.length > 0 ? (
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {links.map((link, i) => (
                <Button key={link.href} asChild variant={i === 0 ? "default" : "outline"} size="lg">
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <ArrowUpRight />
                  </a>
                </Button>
              ))}
            </div>
          </Reveal>
        ) : null}
      </header>

      {/* Primary visual */}
      <Reveal delay={0.1} className="mt-10">
        <ProjectHeroMedia
          src={project.primaryImageUrl}
          alt={project.primaryImageAlt || project.title}
          title={project.title}
        />
      </Reveal>

      {/* Project facts */}
      {showFacts ? (
        <div className="mt-14">
          {statBlocks.length > 0 ? (
            <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {statBlocks.map((block) => (
                <div key={block.label} className="flex flex-col gap-1.5 bg-card px-6 py-5">
                  <dt className="tech-label">{block.label}</dt>
                  <dd className="text-sm font-medium text-foreground">{block.value}</dd>
                </div>
              ))}
            </div>
          ) : null}

          {project.technologies.length > 0 ? (
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
              <span className="tech-label shrink-0">Tech stack</span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.id}
                    className="rounded border border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Case study body */}
      {sections.length > 0 ? (
        <div className="mt-16 space-y-16">
          {sections.map((section, i) => (
            <CaseSection
              key={section.key}
              index={i + 1}
              title={section.title}
              wide={section.wide}
            >
              {section.node}
            </CaseSection>
          ))}
        </div>
      ) : null}

      {/* Pagination */}
      {prev || next ? (
        <ProjectPagination prev={prev ?? null} next={next ?? null} />
      ) : null}

      {/* Related projects */}
      {related.length > 0 ? (
        <section className="mt-20">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Related projects
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
