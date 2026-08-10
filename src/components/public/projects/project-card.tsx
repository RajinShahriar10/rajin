"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string | null;
  category?: string | null;
  status?: string | null;
  primaryImageUrl?: string | null;
  primaryImageAlt?: string | null;
  technologies?: Array<{ id: string; name: string }>;
};

const STATUS_META: Record<string, { label: string; dot: string }> = {
  completed: { label: "Completed", dot: "bg-primary" },
  "in-progress": { label: "In progress", dot: "bg-amber-400" },
  archived: { label: "Archived", dot: "bg-muted-foreground" },
};

function initialsOf(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Premium cover-style project card. The artwork fills the card with a soft
 * mouse parallax; editorial content (number, status, title, stack, CTA) is
 * layered on top. Used by both the homepage carousel and the projects grid.
 */
export function ProjectCard({
  project,
  index,
  className,
}: {
  project: ProjectCardData;
  index?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const coverRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.4 });
  const imgX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const imgY = useTransform(springY, [-0.5, 0.5], [14, -14]);

  const onMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    const el = coverRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const status = project.status ? STATUS_META[project.status] : null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor-text="View"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group relative block aspect-[4/5] overflow-hidden rounded-lg border border-border bg-card",
        "transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-glow",
        className,
      )}
    >
      {/* Artwork */}
      <div ref={coverRef} className="absolute inset-0">
        {project.primaryImageUrl ? (
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{ x: prefersReducedMotion ? 0 : imgX, y: prefersReducedMotion ? 0 : imgY }}
          >
            <CloudinaryImage
              src={project.primaryImageUrl}
              alt={project.primaryImageAlt || project.title}
              fill
              sizes="(min-width: 1024px) 30rem, (min-width: 640px) 45vw, 90vw"
              transform={{ aspect: "4:5", crop: true }}
              className="scale-[1.12] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.16]"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] bg-[length:22px_22px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[7rem] font-bold leading-none text-primary/10 transition-colors duration-300 group-hover:text-primary/20">
                {initialsOf(project.title)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Top row: index + status */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
        {index !== undefined ? (
          <span className="font-mono text-sm text-white/70" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : (
          <span />
        )}
        {status ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-dot", status.dot)} />
            {status.label}
          </span>
        ) : null}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {project.category ? (
          <span className="tech-label inline-flex items-center gap-2 text-primary">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {project.category}
          </span>
        ) : null}

        <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
          {project.title}
        </h3>

        {project.shortDescription ? (
          <p className="mt-1.5 text-sm leading-relaxed text-white/70 line-clamp-2">
            {project.shortDescription}
          </p>
        ) : null}

        <div className="mt-4 flex items-end justify-between gap-3">
          {project.technologies && project.technologies.length > 0 ? (
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech.id}
                  className="rounded border border-white/15 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur-sm"
                >
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 3 ? (
                <span className="rounded border border-white/15 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-white/60 backdrop-blur-sm">
                  +{project.technologies.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}

          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:border-primary"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
