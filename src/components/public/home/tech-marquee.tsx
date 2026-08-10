"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Technical identity band: two counter-scrolling rows of large display type
 * separated by glyphs. Pauses on hover; reduces to static rows under motion
 * preferences.
 */
function MarqueeRow({
  items,
  reverse,
  className,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const row = [...items, ...items];
  const padded = row.length === 0 ? [] : row;

  return (
    <div
      className={cn(
        "flex w-max items-center gap-12 whitespace-nowrap py-1",
        reverse
          ? "animate-marquee-reverse"
          : "animate-marquee",
        "hover:[animation-play-state:paused]",
        className,
      )}
      style={prefersReducedMotion ? { animation: "none" } : undefined}
    >
      {padded.map((item, i) => (
        <span
          key={`${item}-${i}`}
          aria-hidden={i >= items.length}
          className="flex items-center gap-12"
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground/80 transition-colors hover:text-primary sm:text-3xl">
            {item}
          </span>
          <span className="font-mono text-sm text-primary/60" aria-hidden>
            {reverse ? "\\" : "/"}
          </span>
        </span>
      ))}
    </div>
  );
}

export function TechMarquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const reversed = [...items].reverse();

  return (
    <section
      aria-label="Technologies"
      className="relative overflow-hidden border-y border-border bg-muted/30 py-7"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow items={items} />
        <MarqueeRow items={reversed} reverse />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"
      />
    </section>
  );
}
