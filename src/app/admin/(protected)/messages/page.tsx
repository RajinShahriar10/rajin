import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MessagesList } from "@/components/admin/messages-list";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ archived: "asc" }, { read: "asc" }, { createdAt: "desc" }],
  });

  const unread = messages.filter((m) => !m.read && !m.archived).length;

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description={
          unread > 0 ? `${unread} unread message${unread === 1 ? "" : "s"}.` : "No unread messages."
        }
      />
      <MessagesList messages={messages} />
    </div>
  );
}
