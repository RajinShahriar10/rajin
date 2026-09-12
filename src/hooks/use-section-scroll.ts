"use client";

import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCallback, type MouseEvent } from "react";

/**
 * Smooth-scroll handling for links that target a homepage section
 * (`/#section`). On the home page the click is intercepted and the section is
 * scrolled into view; anywhere else the link is left to Next.js navigation.
 */
export function useSectionScroll() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const prefersReducedMotion = useReducedMotion();

  const scrollToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [prefersReducedMotion],
  );

  const handleSectionClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#") || !isHome) return;
    e.preventDefault();
    scrollToId(href.slice(2));
  };

  return { scrollToId, handleSectionClick, isHome };
}