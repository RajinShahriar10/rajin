"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, type Variants } from "motion/react";
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
            animate={prefersReducedMotion ? undefined : { x: [0, 20, 0], y: [0, -18, 0] }}
            transition={ORB_TRANSITION}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            animate={prefersReducedMotion ? undefined : { x: [0, -22, 0], y: [0, 16, 0] }}
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
                      <span className="relative z-10 flex items-center gap-2">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                            selected ? "bg-primary" : "bg-foreground/25 group-hover:bg-primary/60",
                          )}
                          aria-hidden
                        />
                        {category.name}
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
                    <motion.p
                      variants={itemVariants}
                      className="max-w-md text-sm text-muted-foreground"
                    >
                      {active.description}
                    </motion.p>
                  ) : null}

                  {/* Decorative live-loader indicator */}
                  <motion.span
                    variants={itemVariants}
                    aria-hidden
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1"
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-primary/80"
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : { opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }
                        }
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          delay: dot * 0.18,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.span>
                </div>

                {/* Skills with animated loading bars */}
                <motion.ul variants={itemVariants} className="mt-6 space-y-5">
                  {active.skills.map((skill, index) => {
                    const level = Math.min(Math.max(skill.level ?? 80, 5), 100);
                    return (
                      <li key={skill.id} className="group">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex min-w-0 items-center gap-2.5 text-sm font-medium text-foreground">
                            <span
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-[4px] transition-all duration-300",
                                skill.highlight
                                  ? "bg-primary shadow-glow"
                                  : "bg-foreground/25 group-hover:bg-primary/70",
                              )}
                              aria-hidden
                            />
                            <span className="truncate">{skill.name}</span>
                          </span>
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/20 transition-all duration-300 group-hover:animate-pulse-dot group-hover:bg-primary/80"
                            aria-hidden
                          />
                        </div>

                        <div
                          className={cn(
                            "relative mt-2 h-1.5 w-full overflow-hidden rounded-full ring-1 ring-inset transition-colors duration-300",
                            skill.highlight
                              ? "bg-muted ring-primary/20"
                              : "bg-muted/80 ring-border/40 group-hover:ring-primary/30",
                          )}
                        >
                          {/* Diagonal-cut animated fill */}
                          <motion.div
                            className={cn(
                              "relative h-full rounded-full",
                              skill.highlight
                                ? "bg-gradient-to-r from-primary/40 via-primary to-primary/70 shadow-glow"
                                : "bg-gradient-to-r from-primary/25 via-primary/70 to-primary/40",
                            )}
                            style={prefersReducedMotion ? { width: `${level}%` } : undefined}
                            initial={prefersReducedMotion ? false : { width: "0%" }}
                            animate={prefersReducedMotion ? undefined : { width: `${level}%` }}
                            transition={{
                              duration: 0.9,
                              ease: EASE.outExpo,
                              delay: 0.15 + index * 0.05,
                            }}
                          >
                            {!prefersReducedMotion ? (
                              <motion.span
                                aria-hidden
                                className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ left: ["-40%", "130%"] }}
                                transition={{
                                  duration: 1.3,
                                  repeat: Infinity,
                                  ease: EASE.inOutQuint,
                                  repeatDelay: 0.5,
                                }}
                              />
                            ) : null}
                          </motion.div>
                        </div>
                      </li>
                    );
                  })}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}