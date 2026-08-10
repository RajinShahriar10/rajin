"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  setMessageArchivedAction,
  toggleMessageReadAction,
  deleteMessageAction,
} from "@/lib/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDateLong } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: Date;
};

type View = "inbox" | "archived";

export function MessagesList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Message[]>(messages);
  const [view, setView] = useState<View>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>(
    messages.find((m) => !m.read && !m.archived)?.id ?? messages[0]?.id ?? null,
  );

  const visible = items.filter((m) =>
    view === "inbox" ? !m.archived : m.archived,
  );
  const selected = visible.find((m) => m.id === selectedId) ?? null;

  async function toggleRead(message: Message) {
    try {
      await toggleMessageReadAction(message.id, !message.read);
      setItems((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, read: !m.read } : m)),
      );
    } catch {
      toast.error("Could not update message.");
    }
  }

  async function setArchived(message: Message, archived: boolean) {
    try {
      await setMessageArchivedAction(message.id, archived);
      const nextItems = items.map((m) =>
        m.id === message.id ? { ...m, archived } : m,
      );
      setItems(nextItems);
      const nextVisible = nextItems.filter((m) =>
        view === "inbox" ? !m.archived : m.archived,
      );
      if (message.id === selectedId) {
        setSelectedId(nextVisible[0]?.id ?? null);
      }
      toast.success(archived ? "Message archived." : "Message restored.");
      router.refresh();
    } catch {
      toast.error("Could not archive message.");
    }
  }

  async function remove(message: Message) {
    try {
      await deleteMessageAction(message.id);
      const next = items.filter((m) => m.id !== message.id);
      setItems(next);
      if (message.id === selectedId) {
        setSelectedId(next[0]?.id ?? null);
      }
      toast.success("Message deleted.");
      router.refresh();
    } catch {
      toast.error("Could not delete message.");
    }
  }

  const tabs: Array<{ key: View; label: string; count: number }> = [
    {
      key: "inbox",
      label: "Inbox",
      count: items.filter((m) => !m.archived).length,
    },
    {
      key: "archived",
      label: "Archived",
      count: items.filter((m) => m.archived).length,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setView(tab.key);
              setSelectedId(null);
            }}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors",
              view === tab.key && "bg-primary/10 text-foreground",
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2">
          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
              {view === "inbox"
                ? "No messages yet."
                : "No archived messages."}
            </div>
          ) : (
            visible.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => setSelectedId(message.id)}
                className={cn(
                  "w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted/40",
                  selectedId === message.id && "border-primary/50 ring-1 ring-primary/20",
                  !message.read && "bg-primary/5",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-sm font-medium",
                      !message.read && "font-semibold",
                    )}
                  >
                    {message.name}
                  </span>
                  {!message.read ? (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {message.subject || "No subject"}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {message.email} · {formatDateLong(message.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          {selected ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    {selected.subject || "No subject"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    From {selected.name} · {selected.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateLong(selected.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRead(selected)}
                    aria-label={selected.read ? "Mark as unread" : "Mark as read"}
                  >
                    {selected.read ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <MailOpen className="h-4 w-4" />
                    )}
                    {selected.read ? "Unread" : "Read"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setArchived(selected, !selected.archived)}
                    aria-label={selected.archived ? "Unarchive message" : "Archive message"}
                  >
                    {selected.archived ? (
                      <ArchiveRestore className="h-4 w-4" />
                    ) : (
                      <Archive className="h-4 w-4" />
                    )}
                    {selected.archived ? "Restore" : "Archive"}
                  </Button>
                  <DeleteButton
                    onDelete={async () => {
                      await remove(selected);
                      return { ok: true };
                    }}
                    confirmTitle="Delete this message?"
                    confirmDescription={`Message from ${selected.name} will be permanently removed.`}
                  />
                </div>
              </div>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {selected.message}
              </pre>
            </>
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
              Select a message to read it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
