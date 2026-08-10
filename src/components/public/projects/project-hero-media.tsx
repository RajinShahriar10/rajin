"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { DURATION, EASE } from "@/lib/motion";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { cn } from "@/lib/utils";

function monogram(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Case-study hero media. The visual is wiped in with a masked clip reveal on
 * mount and drifts subtly on scroll (parallax), giving the page an immersive
 * film-like entrance.
 */
export function ProjectHeroMedia({
  src,
  alt,
  title,
  className,
}: {
  src?: string | null;
  alt?: string | null;
  title: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.2, 1.12]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-card sm:aspect-[21/9]",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        initial={prefersReducedMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
        animate={prefersReducedMotion ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: DURATION.slow, ease: EASE.outExpo }}
      >
        {src ? (
          <motion.div
            className="absolute inset-0"
            style={
              prefersReducedMotion
                ? { scale: 1 }
                : { y: parallaxY, scale: parallaxScale }
            }
          >
            <CloudinaryImage
              src={src}
              alt={alt || title}
              fill
              priority
              sizes="(min-width: 1280px) 80rem, 100vw"
              transform={{ aspect: "21:9", crop: true }}
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted via-card to-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] bg-[length:26px_26px]" />
            <span className="font-display text-[8rem] font-bold leading-none text-primary/10 sm:text-[11rem]">
              {monogram(title)}
            </span>
          </div>
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5">
        <span className="tech-label text-primary">Primary visual</span>
        <p className="mt-1 font-mono text-xs text-white/70">{title}</p>
      </div>
    </div>
  );
}
