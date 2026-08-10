"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

/** Counts up to `value` when scrolled into view. */
export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp({ end: value, decimals, duration, enabled: inView });

  const formatted =
    decimals > 0
      ? count.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : count.toLocaleString("en-US");

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
