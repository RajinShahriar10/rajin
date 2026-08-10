import type { Transition } from "motion/react";

/**
 * Single source of truth for Motion animation values.
 *
 * Easing values mirror the CSS design tokens in `app/globals.css`
 * (`--ease-out-expo`, `--ease-in-out-quint`) so CSS animations and
 * Motion animations stay in sync. Durations/staggers below are the
 * canonical values used across the site.
 */

export const EASE: Record<"outExpo" | "inOutQuint" | "linear", [number, number, number, number]> = {
  /** Matches CSS `--ease-out-expo`. Standard entrance easing. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Matches CSS `--ease-in-out-quint`. Used for layouts/transitions. */
  inOutQuint: [0.83, 0, 0.17, 1],
  linear: [0, 0, 1, 1],
};

export const DURATION = {
  /** Micro-interactions: hover states, fades. */
  fast: 0.25,
  /** Default interactive motion: nav underline, mobile menu. */
  base: 0.4,
  /** Standard entrances: sections, cards, headlines. */
  standard: 0.6,
  /** Slow, cinematic: hero media, counters. */
  slow: 0.8,
} as const;

export const STAGGER = {
  /** Quick word-level stagger (headlines). */
  quick: 0.06,
  /** Default list/grid child stagger. */
  children: 0.08,
} as const;

/** Default `viewport` config for `whileInView` entrances. */
export const VIEWPORT = { once: true, margin: "-80px" } as const;

/** Vertical offset used when scrolling to a section anchor. */
export const SCROLL_OFFSET = -80;

// Transition presets ---------------------------------------------------------

/** Fade + rise used by `Reveal` and section entrances. */
export function fadeUp(delay = 0): Transition {
  return { duration: DURATION.standard, ease: EASE.outExpo, delay };
}

/** Fade used by page/chrome transitions. */
export function fade(delay = 0): Transition {
  return { duration: DURATION.fast, ease: EASE.linear, delay };
}

/** Container transition that staggers its children. */
export function staggerChildren(stagger = STAGGER.children, delayChildren = 0): Transition {
  return { staggerChildren: stagger, delayChildren };
}

// Variant presets -------------------------------------------------------------

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: fadeUp(delay),
  }),
};

export const staggerContainerVariants = {
  hidden: {},
  visible: { transition: staggerChildren() },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: fadeUp(delay),
  }),
};
