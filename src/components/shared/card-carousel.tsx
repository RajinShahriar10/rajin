"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const GAP = 24;
const CARD_FRACTION = 0.82;
const CARD_MAX = 416;
const AUTOPLAY_MS = 2400;

type CardCarouselProps = {
  children: ReactNode[];
  label: string;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
};

/**
 * Centered card carousel: one card at a time, paged 1-by-1 with the prev/next
 * buttons (or swipe on touch). The active card sits centered; neighbours stay
 * visible but dimmed. Auto-advances smoothly while the section is on screen
 * (the countdown restarts in full every time it scrolls into view) and pauses
 * the moment the user hovers, presses or drags. Pauses for users who prefer
 * reduced motion.
 */
export function CardCarousel({
  children,
  label,
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
}: CardCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(0);
  const [offset, setOffset] = useState(0);
  const [index, setIndex] = useState(0);
  const [liveIndex, setLiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const viewportInView = useInView(viewportRef, { amount: 0.2 });

  const items = Children.toArray(children);
  const count = items.length;
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

  const clamp = useCallback((value: number) => Math.max(0, Math.min(maxIndex, value)), [maxIndex]);

  const goTo = useCallback(
    (target: number) => {
      const next = clamp(target);
      setIndex(next);
      setLiveIndex(next);
      x.set(offset - next * step);
    },
    [clamp, step, offset, x],
  );

  // Re-center when the viewport or page index changes.
  useEffect(() => {
    x.set(offset - index * step);
  }, [offset, index, step, x]);

  // While the user holds or drags, live-update the focused card so the one
  // they are moving towards stays bright instead of dimming under their finger.
  useMotionValueEvent(x, "change", (latest) => {
    if (!pressed && !dragging) return;
    if (step <= 0) return;
    const next = clamp(Math.round((offset - latest) / step));
    setLiveIndex((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (
      prefersReducedMotion ||
      count <= 1 ||
      !viewportInView ||
      hovering ||
      pressed ||
      dragging
    )
      return;
    const id = setInterval(() => {
      goTo(index >= count - 1 ? 0 : index + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion, count, viewportInView, index, hovering, pressed, dragging, goTo]);

  const focusAtPointer = useCallback(() => {
    if (step <= 0) return;
    setLiveIndex(clamp(Math.round((offset - x.get()) / step)));
  }, [step, clamp, offset, x]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") setHovering(true);
      setPressed(true);
      focusAtPointer();
    },
    [focusAtPointer],
  );

  const handlePointerUp = useCallback(() => {
    setPressed(false);
    if (!dragging && liveIndex !== index) goTo(liveIndex);
  }, [dragging, liveIndex, index, goTo]);

  const handlePointerCancel = useCallback(() => setPressed(false), []);

  const handlePointerEnter = useCallback((event: ReactPointerEvent) => {
    if (event.pointerType === "mouse") setHovering(true);
  }, []);

  const handlePointerLeave = useCallback((event: ReactPointerEvent) => {
    if (event.pointerType === "mouse") setHovering(false);
  }, []);

  const onDragStart = useCallback(() => {
    setDragging(true);
    focusAtPointer();
  }, [focusAtPointer]);

  const onDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      setPressed(false);
      setDragging(false);
      if (step <= 0) return;
      let projected = -x.get() + offset - info.offset.x;
      if (Math.abs(info.velocity.x) > 500) projected -= info.velocity.x * 0.15;
      goTo(Math.round(projected / step));
    },
    [goTo, step, offset, x],
  );

  if (count === 0) return null;

  const draggable = !prefersReducedMotion && count > 1;
  const trackX = offset - index * step;

  return (
    <div className={className}>
      <div
        ref={viewportRef}
        className="relative overflow-hidden select-none"
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
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
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {items.map((card, i) => {
            const dist = Math.abs(i - liveIndex);
            const scale = dist === 0 ? 1 : 0.94;
            const opacity = dist === 0 ? 1 : Math.max(1 - dist * 0.3, 0.18);
            return (
              <motion.div
                key={i}
                initial={false}
                style={{ width: cardW || CARD_MAX }}
                className={cn("shrink-0", i > 0 && "ml-6")}
                animate={{ scale, opacity }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
              >
                {card}
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
            aria-label={previousLabel}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === maxIndex}
            aria-label={nextLabel}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}