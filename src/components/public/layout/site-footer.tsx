import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteData, getNavItems } from "@/lib/data/site";
import { initials } from "@/lib/utils";
import { ThemeToggle } from "@/components/public/layout/theme-toggle";
import { SocialIcon } from "@/components/shared/social-icon";

export async function SiteFooter() {
  const { profile, settings, socialLinks } = await getSiteData();
  const navItems = await getNavItems();
  const name = settings.siteName || profile?.name || "Portfolio";
  const copyright = settings.footerCopyright || name;
  const footerText = settings.footerText || profile?.tagline || "";

  return (
    <footer className="border-t border-border">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-accent-soft font-display text-sm font-bold text-primary">
                {initials(profile?.name ?? name)}
              </span>
              <span className="font-display text-sm font-semibold tracking-tight">
                {name}
              </span>
            </Link>
            {footerText ? (
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {footerText}
              </p>
            ) : null}
            <div className="flex items-center gap-1.5">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label || link.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <SocialIcon platform={link.platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="tech-label mb-4">Navigation</p>
            <ul className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="tech-label mb-4">Contact</p>
            <ul className="flex flex-col gap-2.5">
              {profile?.email ? (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {profile.email}
                  </a>
                </li>
              ) : null}
              {profile?.location ? (
                <li className="text-sm text-muted-foreground">
                  {profile.location}
                </li>
              ) : null}
              {profile?.resumeUrl ? (
                <li>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary transition-opacity hover:opacity-80"
                  >
                    Resume <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {copyright}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="tech-label">Software Engineer · C# .NET · Java</p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
