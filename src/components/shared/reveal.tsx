"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ReactNode } from "react";
import { DURATION, EASE } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "span" | "li" | "p" | "section" | "h2" | "h3";
};

export function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  className,
  once = true,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : x,
      y: prefersReducedMotion ? 0 : y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: DURATION.standard, delay, ease: EASE.outExpo },
    },
  };

  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}

export function FadeIn({ children, delay = 0, className }: RevealProps) {
  return (
    <Reveal y={0} delay={delay} className={className}>
      {children}
    </Reveal>
  );
}
