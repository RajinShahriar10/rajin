import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAchievementAction } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { formatDate, truncate } from "@/lib/utils";

export default async function AdminAchievementsPage() {
  const items = await prisma.achievement.findMany({ orderBy: [{ order: "asc" }] });

  return (
    <div>
      <AdminPageHeader
        title="Achievements"
        description="Manage awards and notable accomplishments."
        href="/admin/achievements/new"
        ctaLabel="New achievement"
      />

      <DataTable
        data={items}
        searchPlaceholder="Search achievements..."
        emptyMessage="No achievements yet."
        columns={[
          {
            key: "title",
            header: "Title",
            searchable: true,
            searchValue: (e) => [e.title, e.description, e.category].filter(Boolean).join(" "),
            cell: (e) => (
              <div className="flex items-center gap-3">
                {e.imageUrl ? (
                  <Image
                    src={e.imageUrl}
                    alt={e.imageAlt || e.title}
                    width={56}
                    height={40}
                    className="h-10 w-14 shrink-0 rounded border border-border bg-muted object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-medium">{e.title}</p>
                  {e.description ? (
                    <p className="text-xs text-muted-foreground">{truncate(e.description, 120)}</p>
                  ) : null}
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            cell: (e) => e.category || <span className="text-muted-foreground">—</span>,
          },
          {
            key: "date",
            header: "Date",
            cell: (e) => formatDate(e.date) || "—",
            className: "text-muted-foreground",
          },
          {
            key: "visible",
            header: "Visible",
            cell: (e) =>
              e.visible ? (
                <span className="text-green-600 dark:text-green-400">Yes</span>
              ) : (
                <span className="text-muted-foreground">No</span>
              ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (e) => (
              <div className="flex items-center justify-end gap-1">
                <Button asChild variant="ghost" size="icon" aria-label="Edit achievement">
                  <Link href={`/admin/achievements/${e.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteButton
                  action={deleteAchievementAction}
                  id={e.id}
                  confirmTitle="Delete this achievement?"
                  confirmDescription={`"${e.title}" will be permanently removed.`}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
