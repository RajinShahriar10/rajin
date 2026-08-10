"use client";

import { useEffect, useState } from "react";

type UseScrollSpyOptions = {
  /** The scroll position (px) at which a section is considered active. */
  offset?: number;
  rootMargin?: never;
};

/**
 * Tracks which of the given section ids is currently in view.
 * Returns `null` until a section crosses the offset. The last section wins
 * when the page is scrolled to the bottom.
 */
export function useScrollSpy(ids: string[], options?: UseScrollSpyOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const offset = options?.offset ?? 140;
  const idsKey = ids.join(",");

  useEffect(() => {
    const sectionIds = idsKey.length > 0 ? idsKey.split(",") : [];
    if (sectionIds.length === 0) return;

    const compute = (): string | null => {
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
          current = id;
        } else {
          break;
        }
      }

      const lastId = sectionIds[sectionIds.length - 1];
      const lastEl = document.getElementById(lastId);
      if (
        lastEl &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
      ) {
        current = lastId;
      }

      return current;
    };

    const onScroll = () => setActiveId(compute());

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [idsKey, offset]);

  return activeId;
}
