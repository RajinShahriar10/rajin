"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ProjectCard, type ProjectCardData } from "@/components/public/projects/project-card";
import { ProjectCarousel } from "@/components/public/home/project-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";

/** Card width in the pinned rail; also capped by `min()` for narrow screens. */
const CARD_WIDTH = 384;
const CARD_GAP = 28;

type PinnedProjectsProps = {
  projects: ProjectCardData[];
};

/**
 * One card in the pinned rail. Each card "grows into" focus as the scroll
 * progress passes its own window, so the rail feels directional instead of
 * a flat translate.
 */
function PinnedCard({
  project,
  index,
  count,
  progress,
}: {
  project: ProjectCardData;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const start = index / count;
  const end = (index + 1) / count;
  const scale = useTransform(progress, [start, end], [0.92, 1]);
  const opacity = useTransform(progress, [start, end], [0.6, 1]);

  return (
    <motion.div
      style={{ width: `min(68vw, ${CARD_WIDTH}px)`, scale, opacity }}
      className="shrink-0"
    >
      <ProjectCard project={project} index={index} />
    </motion.div>
  );
}

/**
 * Desktop showcase: the project rail is pinned while the section is tall, and
 * vertical scroll is converted into horizontal movement of the cards. On
 * smaller screens (or under reduced-motion) it falls back to the drag/swipe
 * carousel so the content never depends on the pin.
 */
export function PinnedProjects({ projects }: PinnedProjectsProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = isDesktop && !prefersReducedMotion && projects.length > 1;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const count = projects.length;

  // The outer section must be tall enough that, over its whole height, the
  // rail travels its full width (`scrollWidth - clientWidth`).
  useLayoutEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setDistance(Math.max(0, track.scrollWidth - track.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, projects]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const ghostX = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });
  const current = useTransform(
    scrollYProgress,
    (v) =>
      String(
        Math.max(1, Math.min(count, Math.round(v * (count - 1) + 1))),
      ).padStart(2, "0"),
  );

  if (!pinned) {
    return <ProjectCarousel projects={projects} />;
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Selected projects — horizontal showcase"
      className="relative"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden bg-background">
        {/* Ghost display type that drifts as the rail moves */}
        <motion.div
          aria-hidden="true"
          style={{ x: ghostX }}
          className="pointer-events-none absolute left-0 top-1/2 z-0 select-none"
        >
          <span className="block -translate-y-1/2 whitespace-nowrap font-display text-[19vw] font-bold uppercase leading-none tracking-tight text-foreground/[0.045]">
            Selected Work
          </span>
        </motion.div>

        {/* Counter */}
        <div className="container-page pointer-events-none absolute inset-x-0 top-[calc(var(--nav-height)+1.5rem)] z-10 flex items-center justify-between">
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            Selected Projects
          </p>
          <p className="font-mono text-sm tabular-nums text-muted-foreground">
            <motion.span className="text-foreground">{current}</motion.span>
            <span className="mx-1 text-border">/</span>
            {String(count).padStart(2, "0")}
          </p>
        </div>

        {/* Horizontal rail */}
        <motion.div
          ref={trackRef}
          style={{ x, gap: CARD_GAP }}
          className="rail-gutter z-[1] flex items-center will-change-transform"
        >
          {projects.map((project, i) => (
            <PinnedCard
              key={project.id}
              project={project}
              index={i}
              count={count}
              progress={scrollYProgress}
            />
          ))}
          <div aria-hidden className="w-2 shrink-0" />
        </motion.div>

        {/* Progress bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10">
          <div className="container-page">
            <div className="h-px w-full overflow-hidden rounded bg-border">
              <motion.div
                style={{ scaleX: progressScale }}
                className="h-full origin-left bg-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
