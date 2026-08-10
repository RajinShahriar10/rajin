import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenText,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  MessageSquare,
  Search,
  SearchX,
  Trophy,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { truncate } from "@/lib/utils";

type SearchGroup = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  items: Array<{ id: string; label: string; detail?: string | null; href: string }>;
};

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] | undefined }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q;
  const term = (query ?? "").trim();

  if (!term) {
    return <SearchIntro />;
  }

  const lower = term.toLowerCase();
  const has = (value: string | null | undefined) =>
    Boolean(value?.toLowerCase().includes(lower));

  const [projects, skills, experiences, education, certificates, achievements, research, messages] =
    await Promise.all([
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: { id: true, title: true, shortDescription: true, category: true },
      }),
      prisma.skill.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: {
          id: true,
          name: true,
          category: { select: { name: true } },
        },
      }),
      prisma.experience.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: { id: true, role: true, company: true },
      }),
      prisma.education.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: { id: true, degree: true, institution: true },
      }),
      prisma.certificate.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: { id: true, title: true, issuer: true },
      }),
      prisma.achievement.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: { id: true, title: true },
      }),
      prisma.research.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: { id: true, title: true, category: true, summary: true },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, name: true, email: true, subject: true, message: true },
      }),
    ]);

  const groups: SearchGroup[] = [
    {
      key: "projects",
      label: "Projects",
      icon: LayoutGrid,
      href: "/admin/projects",
      items: projects
        .filter((p) => has(p.title) || has(p.shortDescription) || has(p.category))
        .map((p) => ({
          id: p.id,
          label: p.title,
          detail: p.category ?? null,
          href: `/admin/projects/${p.id}`,
        })),
    },
    {
      key: "skills",
      label: "Skills",
      icon: Users,
      href: "/admin/skills",
      items: skills
        .filter((s) => has(s.name) || has(s.category?.name))
        .map((s) => ({
          id: s.id,
          label: s.name,
          detail: s.category?.name ?? null,
          href: "/admin/skills",
        })),
    },
    {
      key: "experience",
      label: "Experience",
      icon: Briefcase,
      href: "/admin/experience",
      items: experiences
        .filter((e) => has(e.role) || has(e.company))
        .map((e) => ({
          id: e.id,
          label: e.role,
          detail: e.company ?? null,
          href: `/admin/experience/${e.id}`,
        })),
    },
    {
      key: "education",
      label: "Education",
      icon: GraduationCap,
      href: "/admin/education",
      items: education
        .filter((ed) => has(ed.degree) || has(ed.institution))
        .map((ed) => ({
          id: ed.id,
          label: ed.degree,
          detail: ed.institution ?? null,
          href: `/admin/education/${ed.id}`,
        })),
    },
    {
      key: "certificates",
      label: "Certificates",
      icon: Award,
      href: "/admin/certificates",
      items: certificates
        .filter((c) => has(c.title) || has(c.issuer))
        .map((c) => ({
          id: c.id,
          label: c.title,
          detail: c.issuer ?? null,
          href: `/admin/certificates/${c.id}`,
        })),
    },
    {
      key: "achievements",
      label: "Achievements",
      icon: Trophy,
      href: "/admin/achievements",
      items: achievements
        .filter((a) => has(a.title))
        .map((a) => ({
          id: a.id,
          label: a.title,
          detail: null,
          href: `/admin/achievements/${a.id}`,
        })),
    },
    {
      key: "research",
      label: "Research",
      icon: BookOpenText,
      href: "/admin/research",
      items: research
        .filter((r) => has(r.title) || has(r.category) || has(r.summary))
        .map((r) => ({
          id: r.id,
          label: r.title,
          detail: r.category ?? null,
          href: `/admin/research/${r.id}`,
        })),
    },
    {
      key: "messages",
      label: "Messages",
      icon: MessageSquare,
      href: "/admin/messages",
      items: messages
        .filter((m) => has(m.name) || has(m.email) || has(m.subject) || has(m.message))
        .map((m) => ({
          id: m.id,
          label: m.subject || `Message from ${m.name}`,
          detail: `${m.name} · ${m.email}`,
          href: "/admin/messages",
        })),
    },
  ];

  const visibleGroups = groups.filter((group) => group.items.length > 0);
  const total = visibleGroups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Search
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} result{total === 1 ? "" : "s"} for{" "}
          <span className="font-medium text-foreground">
            &quot;{term}&quot;
          </span>
        </p>
      </div>

      {visibleGroups.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No results found for &quot;{term}&quot;. Try a different term.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {visibleGroups.map((group) => (
            <section
              key={group.key}
              className="rounded-lg border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <group.icon className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">{group.label}</h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {group.items.length}
                  </span>
                </div>
                <Link
                  href={group.href}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80"
                >
                  Manage
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {group.items.slice(0, 8).map((item) => (
                  <li key={`${group.key}-${item.id}`}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.label}</p>
                        {item.detail ? (
                          <p className="truncate text-xs text-muted-foreground">
                            {truncate(item.detail, 80)}
                          </p>
                        ) : null}
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIntro() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/30 bg-accent-soft">
        <Search className="h-5 w-5 text-primary" />
      </span>
      <div>
        <h1 className="font-display text-xl font-semibold">Search the admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find projects, skills, messages, research and more from the search box
          in the top bar.
        </p>
      </div>
    </div>
  );
}
