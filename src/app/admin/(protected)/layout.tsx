import { requireAdmin } from "@/lib/auth-guard";
import { getUnreadMessageCount } from "@/lib/data/content";
import { getRecentMessages } from "@/lib/data/admin";
import { AdminShell } from "@/components/admin/shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, unread, notifications] = await Promise.all([
    requireAdmin(),
    getUnreadMessageCount(),
    getRecentMessages(6),
  ]);

  return (
    <AdminShell unread={unread} notifications={notifications}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </AdminShell>
  );
}
