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

// Cosmetic bar widths (no % shown) used when a skill has no explicit level,
// so each bar reads differently without claiming measurable proficiency.
const BAR_WIDTHS = [82, 74, 90, 68, 85, 72, 88, 76, 92, 65, 80, 70];

function skillBarWidth(skill: { level?: number | null; highlight: boolean }, index: number): number {
  if (typeof skill.level === "number" && skill.level > 0) return Math.min(skill.level, 100);
  return Math.min(BAR_WIDTHS[index % BAR_WIDTHS.length] + (skill.highlight ? 6 : 0), 100);
}

export function SkillsSection({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const prefersReducedMotion = useReducedMotion();

  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  if (!active) return null;

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER.quick, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: DURATION.base, ease: EASE.outExpo },
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
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
                      <span className="relative z-10 flex items-center gap-2 lg:justify-start">
                        {selected ? (
                          <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-primary"
                            animate={prefersReducedMotion ? undefined : { scale: [1, 1.45, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground/25 transition-colors group-hover:bg-foreground/50" />
                        )}
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
                {active.description ? (
                  <motion.p variants={rowVariants} className="max-w-md text-sm text-muted-foreground">
                    {active.description}
                  </motion.p>
                ) : null}

                {/* Category transition bar — sweeps in on every tab change */}
                <motion.div
                  variants={rowVariants}
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
                    animate={prefersReducedMotion ? undefined : { left: ["-35%", "120%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Skills as animated loading bars (no percentages) */}
                <div className="mt-8 space-y-4">
                  {active.skills.map((skill, index) => {
                    const width = skillBarWidth(skill, index);
                    const highlighted = skill.highlight;
                    return (
                      <motion.div key={skill.id} variants={rowVariants} className="group">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "text-sm font-medium transition-colors",
                              highlighted ? "text-primary" : "text-foreground/90",
                            )}
                          >
                            {skill.name}
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              "ml-3 h-1 w-1 rounded-full transition-colors",
                              highlighted
                                ? "bg-primary"
                                : "bg-foreground/30 group-hover:bg-foreground/60",
                            )}
                          />
                        </div>

                        <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-border/50">
                          {/* Fill */}
                          <motion.div
                            className={cn(
                              "h-full rounded-full",
                              highlighted
                                ? "bg-gradient-to-r from-primary/70 via-primary to-primary/80 shadow-[0_0_14px_rgba(255,255,255,0.25)]"
                                : "bg-gradient-to-r from-primary/35 via-primary/60 to-primary/35",
                            )}
                            initial={prefersReducedMotion ? false : { width: "0%" }}
                            animate={prefersReducedMotion ? undefined : { width: `${width}%` }}
                            transition={{
                              duration: 0.8,
                              ease: EASE.outExpo,
                              delay: 0.1 + index * 0.05,
                            }}
                          />
                          {/* Shimmer sweep */}
                          <motion.span
                            aria-hidden
                            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={prefersReducedMotion ? false : { left: "-30%" }}
                            animate={prefersReducedMotion ? undefined : { left: ["-30%", "130%"] }}
                            transition={{
                              duration: 1.3,
                              ease: "easeInOut",
                              delay: 0.6 + index * 0.06,
                              repeat: Infinity,
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}