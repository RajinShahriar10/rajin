import { Suspense } from "react";
import { getSiteData, getNavItems } from "@/lib/data/site";
import { SiteHeader } from "@/components/public/layout/site-header";
import { SiteFooter } from "@/components/public/layout/site-footer";
import { PageTransition } from "@/components/shared/page-transition";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { initials } from "@/lib/utils";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, settings } = await getSiteData();
  const navItems = await getNavItems();

  const siteName = settings.siteName || profile?.name || "Portfolio";

  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg transition-transform focus:translate-y-0 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <SmoothScroll>
        <ScrollProgress />
        <SiteHeader
          siteName={siteName}
          initials={initials(profile?.name ?? siteName)}
          navItems={navItems}
          cta={{ label: "Contact", href: "/contact" }}
          resumeUrl={profile?.resumeUrl}
        />
        <main id="main-content" className="flex-1 pt-[var(--nav-height)]">
          <Suspense fallback={null}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </main>
        <SiteFooter />
      </SmoothScroll>
    </div>
  );
}
