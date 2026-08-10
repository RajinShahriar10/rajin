"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * Animated vertical layer flow for a project's architecture. Each admin line
 * becomes a layer card; animated connectors with a travelling dot suggest data
 * moving between layers. Rendered as a vertical stack so deep structures stay
 * readable.
 */
export function ArchitectureFlow({ layers }: { layers: string[] }) {
  return (
    <ol className="mx-auto max-w-2xl" aria-label="Architecture layers">
      {layers.map((layer, i) => (
        <li key={`${layer}-${i}`}>
          <motion.div
            initial={{ opacity: 0, y: 20, x: i % 2 ? 10 : -10 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              ease: EASE.outExpo,
              delay: Math.min(i * 0.06, 0.4),
            }}
            className="group relative flex items-center gap-4 overflow-hidden rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40"
          >
            <span className="font-mono text-sm tabular-nums text-primary/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 font-mono text-sm text-foreground/90">
              {layer}
            </span>
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40 transition-colors group-hover:bg-primary"
            />
          </motion.div>

          {i < layers.length - 1 ? (
            <div
              aria-hidden
              className="relative mx-auto h-10 w-px overflow-visible bg-border/60"
            >
              <span className="absolute left-1/2 top-1/2 -ml-[3px] h-1.5 w-1.5 rounded-full bg-primary animate-flow-dot" />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
