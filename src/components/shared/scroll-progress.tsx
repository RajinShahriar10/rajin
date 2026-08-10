"use client";

import { motion, useSpring } from "motion/react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/**
 * Visible scroll progress bar pinned to the top of the viewport.
 * Driven by `useScrollProgress` (shared with other scroll-aware UI).
 */
export function ScrollProgress() {
  const progress = useScrollProgress();
  const scaleX = useSpring(progress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[110] h-0.5 origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}
