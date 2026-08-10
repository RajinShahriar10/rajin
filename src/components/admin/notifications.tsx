"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NotificationMessage = {
  id: string;
  name: string;
  subject: string | null;
  read: boolean;
  createdAt: Date;
};

export function Notifications({
  unread,
  messages,
}: {
  unread: number;
  messages: NotificationMessage[];
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        >
          <Bell className="h-4.5 w-4.5" />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <span className="text-xs text-muted-foreground">
            {unread} unread
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <MessageSquare className="h-6 w-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
          </div>
        ) : (
          <ul className="max-h-72 divide-y divide-border overflow-y-auto">
            {messages.map((message) => (
              <li key={message.id}>
                <Link
                  href="/admin/messages"
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      message.read ? "bg-muted-foreground/40" : "bg-primary",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {message.subject || "New message"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {message.name}
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

        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link href="/admin/messages">
              <MessageSquare className="h-4 w-4" />
              View all messages
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
