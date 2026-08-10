"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

type Category = {
  id: string;
  name: string;
  description?: string | null;
  skills: Array<{ id: string; name: string; level?: number | null; highlight: boolean }>;
};

export function SkillsSection({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const prefersReducedMotion = useReducedMotion();

  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  if (!active) return null;

  return (
    <section id="skills" className="section-edge scroll-mt-24 bg-muted/20 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Engineering capabilities"
          title="Skills & Technologies"
          description="The languages, frameworks and tools I reach for to ship production software."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[260px_1fr]">
          <Reveal className="min-w-0 lg:order-1">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveId(category.id)}
                  className={cn(
                    "shrink-0 rounded-md border px-4 py-2.5 text-left text-sm transition-colors",
                    category.id === active.id
                      ? "border-primary/50 bg-accent-soft text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="min-w-0 lg:order-2"
            >
              {active.description ? (
                <p className="mb-6 text-sm text-muted-foreground">
                  {active.description}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2.5">
                {active.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm",
                      skill.highlight
                        ? "border-primary/50 bg-accent-soft text-primary"
                        : "border-border bg-card text-foreground",
                    )}
                  >
                    {skill.name}
                    {typeof skill.level === "number" && skill.level > 0 ? (
                      <span className="h-1 w-12 overflow-hidden rounded bg-muted">
                        <span
                          className="block h-full rounded bg-primary"
                          style={{ width: `${Math.min(skill.level, 100)}%` }}
                        />
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
