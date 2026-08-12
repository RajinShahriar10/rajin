"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Terminal } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";

const CHIPS = [
  { code: 'var stack = new[] { "C#", ".NET" };', className: "-left-10 top-8", depth: 1.5, duration: 6 },
  { code: "await DeployToNetlifyAsync();", className: "-right-8 top-1/3", depth: 1.9, duration: 7 },
  { code: 'SELECT TOP 4 * FROM Projects', className: "-left-12 bottom-1/4", depth: 1.2, duration: 5 },
  { code: 'public class Portfolio { }', className: "right-6 -bottom-6", depth: 1.7, duration: 6.5 },
];

function Chip({
  code,
  depth,
  duration,
  className,
  sx,
  sy,
}: {
  code: string;
  depth: number;
  duration: number;
  className?: string;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const prefersReducedMotion = useReducedMotion();
  const x = useTransform(sx, (v) => v * 110 * depth);
  const y = useTransform(sy, (v) => v * 110 * depth);

  return (
    <motion.div
      className={cn("pointer-events-none absolute z-20 hidden lg:block", className)}
      style={{ x, y }}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.base, delay: 1.1, ease: EASE.outExpo }}
    >
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="rounded-md border border-border/70 bg-background/70 px-3 py-1.5 font-mono text-[11px] text-foreground/80 shadow-md backdrop-blur">
            {code}
          </div>
          <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
        </div>
      </motion.div>
    </motion.div>
  );
}

type HeroVisualProps = {
  imageUrl?: string | null;
  imageAlt?: string | null;
};

/**
 * The hero stage: a profile image that reveals through a masked slide, a
 * slow-spinning orbital ring, floating code fragments and a subtle
 * pointer-driven tilt. Fully hidden below `lg` — the mobile hero is a clean
 * typographic composition and never depends on this.
 */
export function HeroVisual({ imageUrl, imageAlt }: HeroVisualProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 110, damping: 18, mass: 0.6 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="relative hidden lg:block [perspective:1200px]">
      {/* orbital ring */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: DURATION.slow, ease: EASE.outExpo }}
      >
        <motion.div
          className="absolute h-[115%] w-[115%] rounded-full border border-dashed border-primary/15"
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute h-[135%] w-[135%] rounded-full border border-border/60" />
      </motion.div>

      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, delay: 0.35, ease: EASE.outExpo }}
          style={{ rotateX, rotateY }}
          className="relative ml-auto aspect-[4/5] w-full max-w-sm"
        >
          {/* masked image reveal */}
          <div className="group relative h-full w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <motion.div
              className="h-full w-full will-change-transform"
              initial={{ y: "108%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.45, ease: EASE.inOutQuint }}
            >
              {imageUrl ? (
                <CloudinaryImage
                  src={imageUrl}
                  alt={imageAlt || "Profile"}
                  fill
                  priority
                  sizes="(min-width: 1024px) 24rem, 0px"
                  transform={{ aspect: "4:5", crop: true, gravity: "center" }}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Terminal className="h-16 w-16 text-primary/40" strokeWidth={1} />
                </div>
              )}
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
          </div>

          {/* status badge */}
          <motion.div
            className="absolute -top-4 right-6 z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: DURATION.base, ease: EASE.outExpo }}
          >
            <span className="tech-label inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 shadow-md backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              Open to opportunities
            </span>
          </motion.div>
        </motion.div>

        <Chip
          code={CHIPS[0].code}
          depth={CHIPS[0].depth}
          duration={CHIPS[0].duration}
          className={CHIPS[0].className}
          sx={sx}
          sy={sy}
        />
        <Chip
          code={CHIPS[1].code}
          depth={CHIPS[1].depth}
          duration={CHIPS[1].duration}
          className={CHIPS[1].className}
          sx={sx}
          sy={sy}
        />
        <Chip
          code={CHIPS[2].code}
          depth={CHIPS[2].depth}
          duration={CHIPS[2].duration}
          className={CHIPS[2].className}
          sx={sx}
          sy={sy}
        />
        <Chip
          code={CHIPS[3].code}
          depth={CHIPS[3].depth}
          duration={CHIPS[3].duration}
          className={CHIPS[3].className}
          sx={sx}
          sy={sy}
        />
      </div>
    </div>
  );
}
