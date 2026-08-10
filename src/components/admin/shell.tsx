"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Award,
  BookOpenText,
  Briefcase,
  ExternalLink,
  FileText,
  GraduationCap,
  Home,
  Images,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Palette,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import { AdminSearch } from "@/components/admin/admin-search";
import {
  Notifications,
  type NotificationMessage,
} from "@/components/admin/notifications";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  group: string;
};

const NAV_GROUPS: Array<{ name: string; items: NavItem[] }> = [
  {
    name: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: Home,
        group: "Overview",
      },
    ],
  },
  {
    name: "Content",
    items: [
      { label: "Profile", href: "/admin/profile", icon: User, group: "Content" },
      { label: "Hero", href: "/admin/hero", icon: Sparkles, group: "Content" },
      { label: "About", href: "/admin/about", icon: FileText, group: "Content" },
      { label: "Projects", href: "/admin/projects", icon: LayoutGrid, group: "Content" },
      { label: "Skills", href: "/admin/skills", icon: Users, group: "Content" },
      { label: "Experience", href: "/admin/experience", icon: Briefcase, group: "Content" },
      { label: "Education", href: "/admin/education", icon: GraduationCap, group: "Content" },
      { label: "Research", href: "/admin/research", icon: BookOpenText, group: "Content" },
      { label: "Certificates", href: "/admin/certificates", icon: Award, group: "Content" },
      { label: "Achievements", href: "/admin/achievements", icon: Trophy, group: "Content" },
      {
        label: "Social Links",
        href: "/admin/social-links",
        icon: Share2,
        group: "Content",
      },
      {
        label: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
        group: "Content",
      },
    ],
  },
  {
    name: "Site",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings, group: "Site" },
      { label: "Media", href: "/admin/media", icon: Images, group: "Site" },
      { label: "Appearance", href: "/admin/appearance", icon: Palette, group: "Site" },
      { label: "Account", href: "/admin/account", icon: Shield, group: "Site" },
    ],
  },
];

export function AdminShell({
  children,
  unread,
  notifications,
}: {
  children: React.ReactNode;
  unread: number;
  notifications: NotificationMessage[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/30 bg-accent-soft font-display text-xs font-bold text-primary">
          RS
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Portfolio CMS</p>
          <p className="tech-label">Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.name} className="mb-5">
            <p className="tech-label px-2 pb-2">{group.name}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                      active
                        ? "bg-accent-soft text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.href === "/admin/messages" && unread > 0 ? (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <Button asChild variant="ghost" size="sm" className="w-full justify-start">
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#admin-content"
        className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg transition-transform focus:translate-y-0 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-card lg:block">
        {SidebarContent}
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="hidden min-w-0 md:block">
              <AdminBreadcrumbs />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <AdminSearch />
            </div>
            <Notifications unread={unread} messages={notifications} />
            <Link
              href="/"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-primary lg:inline-flex"
            >
              View site
            </Link>
          </div>
        </header>

        {mobileOpen ? (
          <div className="fixed inset-0 z-20 top-16 lg:hidden">
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-card">
              <div className="shrink-0 border-b border-border p-3">
                <AdminSearch />
              </div>
              <div className="min-h-0 flex-1">{SidebarContent}</div>
            </div>
          </div>
        ) : null}

        <main id="admin-content" className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
