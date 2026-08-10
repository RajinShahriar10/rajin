"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, SearchX } from "lucide-react";
import { ProjectCard, type ProjectCardData } from "@/components/public/projects/project-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DURATION, EASE, STAGGER, staggerContainerVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ProjectsGrid({ projects }: { projects: ProjectCardData[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (active !== "All" && p.category !== active) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.category,
        p.shortDescription,
        ...(p.technologies?.map((t) => t.name) ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, active, query]);

  const container = prefersReducedMotion
    ? undefined
    : staggerContainerVariants;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {categories.length > 1 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
            {categories.map((category) => {
              const selected = active === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(category)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    selected
                      ? "border-primary/50 bg-accent-soft text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        ) : (
          <div />
        )}

        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <SearchX className="h-4 w-4" />
            </button>
          ) : null}
        </label>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {filtered.length > 0 ? (
          <motion.ul
            key={`${active}-${query}`}
            variants={container}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project, i) => (
              <motion.li
                key={project.id}
                layout
                variants={
                  prefersReducedMotion
                    ? undefined
                    : {
                        hidden: {
                          opacity: 0,
                          y: 20,
                          transition: { duration: DURATION.standard, ease: EASE.outExpo },
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: DURATION.standard,
                            ease: EASE.outExpo,
                            delay: Math.min(i * STAGGER.quick, 0.3),
                          },
                        },
                      }
                }
              >
                <ProjectCard project={project} index={i} className="h-full" />
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            <p className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              {query
                ? `No projects match "${query}".`
                : "No projects in this category yet."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
