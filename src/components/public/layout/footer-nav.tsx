"use client";

import Link from "next/link";
import { useSectionScroll } from "@/hooks/use-section-scroll";

type NavItem = { label: string; href: string; key: string };

export function FooterNav({ items }: { items: NavItem[] }) {
  const { handleSectionClick } = useSectionScroll();

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            onClick={(e) => handleSectionClick(e, item.href)}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}