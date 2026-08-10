import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Award,
  BookOpenText,
  CheckCircle2,
  FilePlus2,
  FolderPlus,
  Images,
  LayoutGrid,
  MessageSquare,
  Settings,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";
import {
  getDashboardStats,
  getRecentActivity,
  getRecentMessages,
  type ActivityItem,
} from "@/lib/data/admin";
import { cn, truncate } from "@/lib/utils";

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  project: LayoutGrid,
  experience: Users,
  education: BookOpenText,
  certificate: Award,
  achievement: Trophy,
  research: BookOpenText,
  skill: Users,
  message: MessageSquare,
  media: Images,
};

const QUICK_ACTIONS = [
  { label: "Edit hero", href: "/admin/hero", icon: Sparkles },
  { label: "New project", href: "/admin/projects/new", icon: FolderPlus },
  { label: "Update profile", href: "/admin/profile", icon: Users },
  { label: "Upload media", href: "/admin/media", icon: Images },
  { label: "Site settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const [stats, activity, recentMessages] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(10),
    getRecentMessages(5),
  ]);

  const firstName = session.user?.name?.split(" ")[0] ?? "Admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const cards = [
    {
      label: "Projects",
      value: stats.projects,
      sub: `${stats.published} published`,
      href: "/admin/projects",
      icon: LayoutGrid,
    },
    {
      label: "Featured projects",
      value: stats.featured,
      sub: "highlighted on home",
      href: "/admin/projects",
      icon: Sparkles,
    },
    {
      label: "Skills",
      value: stats.skills,
      sub: "across categories",
      href: "/admin/skills",
      icon: Users,
    },
    {
      label: "Certificates",
      value: stats.certificates,
      sub: "credentials earned",
      href: "/admin/certificates",
      icon: Award,
    },
    {
      label: "Research",
      value: stats.research,
      sub: "publications & notes",
      href: "/admin/research",
      icon: BookOpenText,
    },
    {
      label: "Achievements",
      value: stats.achievements,
      sub: "milestones recorded",
      href: "/admin/achievements",
      icon: Trophy,
    },
    {
      label: "Published content",
      value: stats.published,
      sub: "projects live on site",
      href: "/admin/projects",
      icon: CheckCircle2,
    },
    {
      label: "Messages",
      value: stats.messages,
      sub: `${stats.unread} unread`,
      href: "/admin/messages",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <FilePlus2 className="h-4 w-4" />
          New project
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
                <card.icon className="h-4 w-4 text-primary" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground/0 transition-colors group-hover:text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold leading-none">
                {card.value}
              </p>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {card.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-sm font-semibold">Recent activity</h2>
            <Link
              href="/admin/projects"
              className="text-xs font-medium text-primary hover:opacity-80"
            >
              View all
            </Link>
          </div>

          {activity.length === 0 ? (
            <EmptyState label="No recent activity yet. Changes you make will appear here." />
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((item) => (
                <ActivityRow key={`${item.type}-${item.id}`} item={item} />
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-display text-sm font-semibold">Inbox</h2>
              <Link
                href="/admin/messages"
                className="text-xs font-medium text-primary hover:opacity-80"
              >
                View all
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">No messages yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentMessages.map((message) => (
                  <li key={message.id}>
                    <Link
                      href="/admin/messages"
                      className="flex items-start justify-between gap-3 px-6 py-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              message.read ? "bg-muted-foreground/40" : "bg-primary",
                            )}
                          />
                          <span className="truncate">{message.name}</span>
                        </p>
                        <p className="mt-0.5 truncate pl-3.5 text-xs text-muted-foreground">
                          {message.subject || "No subject"}
                        </p>
                      </div>
                      <time className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-sm font-semibold">Quick actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <action.icon className="h-4 w-4 text-primary" />
                  {action.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center px-6 py-10 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = ACTIVITY_ICONS[item.type] ?? LayoutGrid;
  const detail = item.detail ? ` · ${truncate(item.detail, 60)}` : "";
  return (
    <li>
      <Link
        href={item.href}
        className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/40"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{item.label}</p>
          <p className="truncate text-xs text-muted-foreground">
            <span className={item.action === "created" ? "text-emerald-500" : undefined}>
              {item.action === "created" ? "Created" : "Updated"}
            </span>
            {detail}
          </p>
        </div>
        <time className="shrink-0 text-xs text-muted-foreground">
          {formatDistanceToNow(item.at, { addSuffix: true })}
        </time>
      </Link>
    </li>
  );
}
