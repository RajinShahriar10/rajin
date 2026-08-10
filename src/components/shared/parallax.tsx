"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Peak vertical drift in px between the element entering and leaving view. */
  strength?: number;
};

/** Subtle scroll-linked vertical parallax. Disabled under reduced motion. */
export function Parallax({ children, className, strength = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [strength, -strength]),
    { stiffness: 110, damping: 24, mass: 0.6 },
  );

  return (
    <motion.div ref={ref} className={className} style={{ y: prefersReducedMotion ? 0 : y }}>
      {children}
    </motion.div>
  );
}
