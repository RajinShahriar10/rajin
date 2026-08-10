"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/public/layout/theme-toggle";
import { Magnetic } from "@/components/shared/magnetic";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

type NavItem = { label: string; href: string; key: string };

type SiteHeaderProps = {
  siteName: string;
  initials: string;
  navItems: NavItem[];
  cta?: { label: string; href: string };
  resumeUrl?: string | null;
};

/** Home-page sections tracked by the scrollspy. */
const SPY_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "research",
  "certificates",
  "achievements",
  "contact",
];

/** Sections that map to a primary nav item for active highlighting. */
const SECTION_TO_NAV: Record<string, string> = {
  about: "about",
  projects: "projects",
  experience: "experience",
  research: "research",
  contact: "contact",
};

export function SiteHeader({
  siteName,
  initials,
  navItems,
  cta,
  resumeUrl,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const prefersReducedMotion = useReducedMotion();
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const activeSection = useScrollSpy(isHome ? SPY_IDS : [], { offset: 140 });
  const sectionNavKey = activeSection ? SECTION_TO_NAV[activeSection] : null;

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuPanelRef.current?.querySelector("a")?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isPageActive = (item: NavItem) =>
    pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 shadow-lg shadow-background/40 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-16" : "h-[var(--nav-height)]",
        )}
      >
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${siteName} - home`}
        >
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-accent-soft font-display text-sm font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground",
              scrolled && "scale-90",
            )}
          >
            {initials}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
            {siteName}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const active = sectionNavKey
              ? item.key === sectionNavKey
              : isPageActive(item);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-primary"
                    transition={{ duration: DURATION.base, ease: EASE.outExpo }}
                  />
                )}
              </Link>
            );
          })}
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Resume
              <ArrowUpRight className="h-3.5 w-3.5 text-primary/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : null}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {cta && (
            <Magnetic className="hidden md:block">
              <Button asChild variant="default" size="sm" className="ml-2">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </Magnetic>
          )}
          <Button
            ref={menuToggleRef}
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION.fast }}
            className="fixed inset-0 top-[var(--nav-height)] z-50 bg-background/95 backdrop-blur-xl lg:hidden"
            id="mobile-menu"
            ref={menuPanelRef}
          >
            <nav
              className="container-page flex h-full flex-col gap-1 py-8"
              aria-label="Mobile navigation"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : 16,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.05 + i * STAGGER.quick,
                    duration: DURATION.base,
                    ease: EASE.outExpo,
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-2 py-4 font-display text-2xl font-semibold tracking-tight",
                      sectionNavKey
                        ? item.key === sectionNavKey && "text-primary"
                        : pathname === item.href
                          ? "text-primary"
                          : "text-foreground",
                    )}
                  >
                    {item.label}
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
              {resumeUrl ? (
                <motion.div
                  key="resume"
                  initial={{
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : 16,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.05 + navItems.length * STAGGER.quick,
                    duration: DURATION.base,
                    ease: EASE.outExpo,
                  }}
                >
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg px-2 py-4 font-display text-2xl font-semibold tracking-tight text-foreground"
                  >
                    Resume
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </a>
                </motion.div>
              ) : null}
              {cta && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: DURATION.base }}
                  className="mt-auto"
                >
                  <Button asChild size="lg" className="w-full">
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
