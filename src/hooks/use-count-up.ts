"use client";

import { useEffect, useState } from "react";
import { animate } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/motion";

type UseCountUpOptions = {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  enabled?: boolean;
};

/**
 * Animates a number from `start` to `end` when `enabled` becomes true.
 * Respects the user's reduced-motion preference by jumping straight to `end`.
 */
export function useCountUp({
  end,
  start = 0,
  duration = 1.6,
  delay = 0,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions): number {
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!enabled) return;

    const controls = animate(0, end - start, {
      duration: prefersReducedMotion ? 0.001 : duration,
      delay,
      ease: prefersReducedMotion ? "linear" : EASE.outExpo,
      onUpdate: (latest) => setValue(start + latest),
    });

    return () => controls.stop();
  }, [end, start, duration, delay, enabled, prefersReducedMotion]);

  return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
}
