"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

export function AnimatedHeadline({
  text,
  className,
  accentWords = [],
}: {
  text: string;
  className?: string;
  accentWords?: string[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.h1
      className={cn(
        "font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl md:text-7xl xl:text-8xl",
        className,
      )}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: prefersReducedMotion ? 0 : STAGGER.quick },
        },
      }}
    >
      {words.map((word, i) => {
        const isAccent = accentWords.some(
          (w) => word.toLowerCase() === w.toLowerCase(),
        );
        return (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-1 align-top"
          >
            <motion.span
              className={cn(
                "inline-block will-change-transform",
                isAccent && "text-primary",
              )}
              variants={{
                hidden: {
                  y: prefersReducedMotion ? 0 : "110%",
                  opacity: prefersReducedMotion ? 0 : 1,
                },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: DURATION.slow, ease: EASE.outExpo },
                },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </motion.h1>
  );
}
