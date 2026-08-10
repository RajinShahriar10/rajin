import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

type AdjacentProject = {
  slug: string;
  title: string;
  category?: string | null;
};

/**
 * Prev/next navigation between published projects.
 * Sibling slots render as empty placeholders so the grid stays even.
 */
export function ProjectPagination({
  prev,
  next,
}: {
  prev: AdjacentProject | null;
  next: AdjacentProject | null;
}) {
  if (!prev && !next) return null;

  const link = (dir: "prev" | "next", project: AdjacentProject) => (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40",
        dir === "next" && "text-right",
      )}
    >
      <span
        className={cn(
          "tech-label inline-flex items-center gap-1.5",
          dir === "next" && "flex-row-reverse",
        )}
      >
        {dir === "prev" ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        {dir === "prev" ? "Previous project" : "Next project"}
      </span>
      <span className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
        {project.title}
      </span>
      {project.category ? (
        <span className="text-sm text-muted-foreground">{project.category}</span>
      ) : null}
    </Link>
  );

  return (
    <Reveal className="mt-16">
      <nav
        aria-label="Project navigation"
        className="grid gap-4 sm:grid-cols-2"
      >
        {prev ? link("prev", prev) : <div />}
        {next ? link("next", next) : <div />}
      </nav>
    </Reveal>
  );
}
