"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiDocker,
  SiDotnet,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/motion";

type TechLogo = {
  Icon: IconType;
  name: string;
  color: string;
  left: number;
  top: number;
  size: number;
  depth: number;
  duration: number;
  delay: number;
};

const LOGOS: TechLogo[] = [
  { Icon: SiReact, name: "React", color: "#61DAFB", left: 70, top: 4, size: 24, depth: 1.6, duration: 7, delay: 0.5 },
  { Icon: SiTypescript, name: "TypeScript", color: "#3178C6", left: 86, top: 15, size: 18, depth: 1.2, duration: 6, delay: 1.1 },
  { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E", left: 62, top: 16, size: 16, depth: 0.9, duration: 5.5, delay: 0.8 },
  { Icon: SiSharp, name: "C#", color: "#A179DC", left: 90, top: 40, size: 20, depth: 1.8, duration: 6.5, delay: 1.6 },
  { Icon: SiDotnet, name: ".NET", color: "#512BD4", left: 68, top: 46, size: 22, depth: 1.3, duration: 7.5, delay: 0.3 },
  { Icon: SiPython, name: "Python", color: "#F7C948", left: 84, top: 64, size: 19, depth: 1.0, duration: 6, delay: 1.9 },
  { Icon: SiOpenjdk, name: "Java", color: "#7BA7D7", left: 65, top: 76, size: 17, depth: 1.5, duration: 5.5, delay: 0.7 },
  { Icon: SiCplusplus, name: "C++", color: "#6A9BC7", left: 78, top: 88, size: 15, depth: 0.9, duration: 6.5, delay: 1.3 },
  { Icon: SiMysql, name: "SQL", color: "#B9C9EA", left: 55, top: 84, size: 16, depth: 1.2, duration: 7, delay: 0.2 },
  { Icon: SiHtml5, name: "HTML5", color: "#E34F26", left: 9, top: 10, size: 18, depth: 1.1, duration: 6.5, delay: 1.0 },
  { Icon: SiTailwindcss, name: "Tailwind CSS", color: "#38BDF8", left: 27, top: 7, size: 17, depth: 0.8, duration: 5.5, delay: 0.6 },
  { Icon: SiNodedotjs, name: "Node.js", color: "#5FA04E", left: 5, top: 54, size: 20, depth: 1.4, duration: 6, delay: 1.7 },
  { Icon: SiDocker, name: "Docker", color: "#2496ED", left: 15, top: 86, size: 22, depth: 1.0, duration: 7, delay: 0.4 },
  { Icon: SiGit, name: "Git", color: "#F05032", left: 32, top: 90, size: 17, depth: 0.8, duration: 5.5, delay: 2.2 },
];

function FloatingLogo({
  Icon,
  name,
  color,
  left,
  top,
  size,
  depth,
  duration,
  delay,
  reduced,
  sx,
  sy,
}: TechLogo & {
  reduced: boolean;
  sx: ReturnType<typeof useMotionValue<number>>;
  sy: ReturnType<typeof useMotionValue<number>>;
}) {
  const x = useTransform(sx, (v) => v * 70 * depth);
  const y = useTransform(sy, (v) => v * 70 * depth);

  return (
    <motion.div
      className="absolute"
      style={{ left: `${left}%`, top: `${top}%`, x, y }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.55, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE.outExpo }}
    >
      <motion.div
        className="will-change-transform"
        animate={reduced ? undefined : { y: [-7, 7, -7] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-card/60 shadow-lg shadow-black/20 backdrop-blur-md">
          <Icon style={{ color }} size={size} aria-hidden="true" />
        </div>
        <span className="sr-only">{name}</span>
      </motion.div>
    </motion.div>
  );
}

/**
 * Ambient layer of drifting programming-language trademarks laid over the hero.
 * Desktop-only (the mobile hero stays a clean typographic composition).
 * Logos float, respond to the pointer with depth parallax, and respect
 * `prefers-reduced-motion`.
 */
export function TechLogoField() {
  const prefersReducedMotion = useReducedMotion();
  const logoRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 45, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onPointerMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [prefersReducedMotion, mx, my]);

  return (
    <div
      ref={logoRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {prefersReducedMotion && (
        <div className="absolute inset-0 rounded-full bg-primary/[0.04] blur-[160px]" />
      )}
      <div className="absolute inset-0">
        {LOGOS.map((logo) => (
          <FloatingLogo
            key={logo.name}
            {...logo}
            reduced={Boolean(prefersReducedMotion)}
            sx={sx}
            sy={sy}
          />
        ))}
      </div>
    </div>
  );
}