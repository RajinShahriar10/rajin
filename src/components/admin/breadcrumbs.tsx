"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/profile": "Profile",
  "/admin/hero": "Hero",
  "/admin/about": "About",
  "/admin/projects": "Projects",
  "/admin/skills": "Skills",
  "/admin/experience": "Experience",
  "/admin/education": "Education",
  "/admin/certificates": "Certificates",
  "/admin/achievements": "Achievements",
  "/admin/research": "Research",
  "/admin/social-links": "Social Links",
  "/admin/messages": "Messages",
  "/admin/media": "Media",
  "/admin/settings": "Site Settings",
  "/admin/appearance": "Appearance",
  "/admin/account": "Account",
  "/admin/search": "Search",
};

function segmentLabel(segment: string): string {
  if (segment === "new") return "New";
  if (segment.length >= 15) return "Edit";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();

  const crumbs: Array<{ label: string; href: string }> = [];
  let acc = "";
  for (const segment of pathname.split("/").filter(Boolean)) {
    acc += `/${segment}`;
    crumbs.push({
      label: LABELS[acc] ?? segmentLabel(segment),
      href: acc,
    });
  }
  if (crumbs.length === 0) {
    crumbs.push({ label: "Dashboard", href: "/admin/dashboard" });
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              ) : null}
              {isLast ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
