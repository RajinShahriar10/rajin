"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedHeadline } from "@/components/public/home/animated-headline";
import { HeroBackground } from "@/components/public/three/hero-background";
import { HeroVisual } from "@/components/public/home/hero-visual";
import { Magnetic } from "@/components/shared/magnetic";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { parseStat } from "@/lib/stats";
import { fadeUp } from "@/lib/motion";

type HeroData = {
  eyebrow?: string | null;
  headline: string;
  subheadline?: string | null;
  description?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  profileImageUrl?: string | null;
  profileImageAlt?: string | null;
  background?: string | null;
  stats: Array<{ id: string; label: string; value: string }>;
};

type HeroProps = {
  hero: HeroData;
};

export function HeroSection({ hero }: HeroProps) {
  const stats = hero.stats ?? [];

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh-var(--nav-height))] items-center overflow-hidden"
    >
      <div aria-hidden="true" className="hidden lg:block">
        <HeroBackground variant={hero.background} />
      </div>

      {/* editorial glow, kept subtle so the text stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-primary/[0.07] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background"
      />

      <div className="container-page relative z-10 grid gap-12 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
        <div className="flex flex-col items-start gap-6">
          {hero.eyebrow ? (
            <motion.p
              className="tech-label flex items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(0.05)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
              {hero.eyebrow}
            </motion.p>
          ) : null}

          <AnimatedHeadline
            text={hero.headline}
            accentWords={["secure", "full-stack", "desktop", "software"]}
          />

          {hero.subheadline ? (
            <motion.p
              className="font-display text-sm font-medium uppercase tracking-[0.2em] text-primary/80 sm:text-base"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(0.25)}
            >
              {hero.subheadline}
            </motion.p>
          ) : null}

          {hero.description ? (
            <motion.p
              className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(0.45)}
            >
              {hero.description}
            </motion.p>
          ) : null}

          {(hero.primaryCtaLabel || hero.secondaryCtaLabel) && (
            <motion.div
              className="mt-2 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(0.55)}
            >
              {hero.primaryCtaLabel && hero.primaryCtaHref && (
                <Magnetic>
                  <Button asChild size="lg">
                    <Link href={hero.primaryCtaHref}>
                      {hero.primaryCtaLabel}
                      <ArrowUpRight />
                    </Link>
                  </Button>
                </Magnetic>
              )}
              {hero.secondaryCtaLabel && hero.secondaryCtaHref && (
                <Magnetic>
                  <Button asChild variant="outline" size="lg">
                    <Link href={hero.secondaryCtaHref}>
                      {hero.secondaryCtaLabel}
                    </Link>
                  </Button>
                </Magnetic>
              )}
            </motion.div>
          )}

          {stats.length > 0 && (
            <motion.dl
              className="mt-6 grid w-full max-w-lg grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(0.65)}
            >
              {stats.map((stat) => {
                const parsed = parseStat(stat.value);
                return (
                  <div
                    key={stat.id}
                    className="flex flex-col gap-1 bg-card px-5 py-4"
                  >
                    <dt className="order-2 text-xs text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="order-1 font-display text-2xl font-semibold text-foreground">
                      {parsed.number !== null ? (
                        <AnimatedNumber
                          value={parsed.number}
                          prefix={parsed.prefix}
                          suffix={parsed.suffix}
                        />
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </div>
                );
              })}
            </motion.dl>
          )}
        </div>

        <HeroVisual
          imageUrl={hero.profileImageUrl}
          imageAlt={hero.profileImageAlt}
        />
      </div>

      <motion.a
        href="#projects"
        aria-label="Scroll to projects"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary"
        data-cursor-text="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={fadeUp(1.4)}
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </motion.a>
    </section>
  );
}
