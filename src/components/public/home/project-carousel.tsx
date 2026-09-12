"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ProjectCard, type ProjectCardData } from "@/components/public/projects/project-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const GAP = 24;
const CARD_FRACTION = 0.82;
const CARD_MAX = 416;

/**
 * Centered project carousel: one card at a time, paged 1-by-1 with the
 * prev/next buttons (or swipe on touch). The active card sits in the middle of
 * the viewport; neighbours fade out until they reach the center.
 */
export function ProjectCarousel({ projects }: { projects: ProjectCardData[] }) {
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(0);
  const [offset, setOffset] = useState(0);
  const [index, setIndex] = useState(0);

  const count = projects.length;
  const step = cardW + GAP;
  const maxIndex = Math.max(count - 1, 0);
  const progress = maxIndex > 0 ? index / maxIndex : 1;

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 38, mass: 0.6 });

  // Measure the viewport so cards, the center offset and snap steps are exact.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const nextCard = Math.min(Math.max(w * CARD_FRACTION, 260), CARD_MAX);
      setCardW(nextCard);
      setOffset(Math.max(0, (w - nextCard) / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const next = Math.max(0, Math.min(maxIndex, target));
      setIndex(next);
      x.set(offset - next * step);
    },
    [maxIndex, step, offset, x],
  );

  // Re-center when the viewport or page index changes.
  useEffect(() => {
    x.set(offset - index * step);
  }, [offset, index, step, x]);

  const onDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (step <= 0) return;
      let projected = -x.get() + offset - info.offset.x;
      if (Math.abs(info.velocity.x) > 500) projected -= info.velocity.x * 0.15;
      const next = Math.round(projected / step);
      goTo(next);
    },
    [goTo, step, offset, x],
  );

  const draggable = !prefersReducedMotion && count > 1;
  const trackX = offset - index * step;

  return (
    <div>
      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
      >
        <motion.div
          className={cn(
            "flex will-change-transform",
            draggable && "cursor-grab active:cursor-grabbing",
          )}
          style={draggable ? { x: springX } : undefined}
          animate={!draggable ? { x: trackX } : undefined}
          transition={!draggable ? { duration: 0 } : undefined}
          drag={draggable ? "x" : false}
          dragConstraints={{ left: offset - maxIndex * step, right: offset }}
          dragElastic={0.1}
          onDragEnd={onDragEnd}
        >
          {projects.map((project, i) => {
            const dist = Math.abs(i - index);
            const scale = dist === 0 ? 1 : 0.92;
            const opacity = dist === 0 ? 1 : Math.max(1 - dist * 0.35, 0.15);
            return (
              <motion.div
                key={project.id}
                initial={false}
                style={{ width: cardW || CARD_MAX }}
                className={cn("shrink-0", i > 0 && "ml-6")}
                animate={{ scale, opacity }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="h-px max-w-72 flex-1 overflow-hidden rounded bg-border">
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(progress * 100, 2)}%` }}
          />
        </div>

        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
          <span className="mx-1 text-border">/</span>
          {String(count).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous project"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === maxIndex}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
