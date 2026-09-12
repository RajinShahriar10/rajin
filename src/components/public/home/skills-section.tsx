"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, type Variants } from "motion/react";
import { Sparkles } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

type Category = {
  id: string;
  name: string;
  description?: string | null;
  skills: Array<{ id: string; name: string; level?: number | null; highlight: boolean }>;
};

const ORB_TRANSITION = { duration: 11, repeat: Infinity, ease: "easeInOut" as const };

export function SkillsSection({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const prefersReducedMotion = useReducedMotion();

  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  if (!active) return null;

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER.quick, delayChildren: 0.12 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.base, ease: EASE.outExpo },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -8,
      transition: { duration: DURATION.fast, ease: EASE.linear },
    },
  };

  return (
    <section id="skills" className="section-edge scroll-mt-24 bg-muted/20 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Engineering capabilities"
          title="Skills & Technologies"
          description="The languages, frameworks and tools I reach for to ship production software."
          align="center"
        />

        <div className="relative mx-auto mt-14 grid max-w-5xl gap-10 overflow-hidden lg:grid-cols-[260px_1fr]">
          {/* Ambient backdrop glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, 20, 0], y: [0, -18, 0] }
            }
            transition={ORB_TRANSITION}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, -22, 0], y: [0, 16, 0] }
            }
            transition={ORB_TRANSITION}
          />

          {/* Category tabs */}
          <Reveal className="relative z-10 min-w-0 lg:order-1">
            <LayoutGroup id="skills-tabs">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:gap-2">
                {categories.map((category) => {
                  const selected = category.id === active.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveId(category.id)}
                      aria-label={`Show ${category.name} skills`}
                      className={cn(
                        "group relative shrink-0 rounded-md px-4 py-2.5 text-left text-sm transition-colors",
                        selected
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {selected ? (
                        <motion.span
                          layoutId="skills-tab-active"
                          className="absolute inset-0 rounded-md border border-primary/50 bg-accent-soft"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      ) : null}
                      <span className="relative z-10 flex items-center justify-between gap-2 lg:justify-start">
                        {category.name}
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] tabular-nums transition-colors",
                            selected
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-muted/50 text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          {category.skills.length}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </Reveal>

          {/* Active category panel */}
          <div className="relative z-10 min-w-0 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                variants={containerVariants}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                exit={prefersReducedMotion ? undefined : "exit"}
                className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {active.description ? (
                    <motion.p variants={itemVariants} className="max-w-md text-sm text-muted-foreground">
                      {active.description}
                    </motion.p>
                  ) : null}
                  <motion.span
                    variants={itemVariants}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    <Sparkles className="h-3 w-3" />
                    {active.skills.length} skill{active.skills.length === 1 ? "" : "s"}
                  </motion.span>
                </div>

                {/* Loading bar — fills every time the category changes */}
                <motion.div
                  variants={itemVariants}
                  className="relative mt-5 h-1.5 w-full overflow-hidden rounded-full bg-border/70"
                >
                  <motion.div
                    className="relative h-full rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
                    initial={prefersReducedMotion ? false : { width: "0%" }}
                    animate={prefersReducedMotion ? undefined : { width: "100%" }}
                    transition={{ duration: 0.9, ease: EASE.outExpo }}
                  />
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { left: ["-35%", "120%"] }
                    }
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  {active.skills.map((skill) => (
                    <motion.span
                      key={skill.id}
                      variants={itemVariants}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm",
                        skill.highlight
                          ? "border-primary/50 bg-accent-soft text-primary"
                          : "border-border bg-card text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          skill.highlight ? "bg-primary" : "bg-foreground/40",
                        )}
                        aria-hidden
                      />
                      {skill.name}
                      {typeof skill.level === "number" && skill.level > 0 ? (
                        <span className="h-1 w-12 overflow-hidden rounded bg-muted">
                          <motion.span
                            className="block h-full rounded bg-primary"
                            initial={prefersReducedMotion ? false : { width: "0%" }}
                            animate={
                              prefersReducedMotion
                                ? undefined
                                : { width: `${Math.min(skill.level, 100)}%` }
                            }
                            transition={{ duration: 0.7, ease: EASE.outExpo, delay: 0.2 }}
                          />
                        </span>
                      ) : null}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}