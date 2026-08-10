"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () =>
    import("@/components/public/three/hero-scene").then(
      (m) => m.HeroScene,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HeroBackground({ variant }: { variant?: string | null }) {
  if (variant === "none" || !variant) return null;
  return <HeroScene variant={variant} />;
}
