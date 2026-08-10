import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteResearchAction } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, truncate } from "@/lib/utils";

export default async function AdminResearchPage() {
  const items = await prisma.research.findMany({
    orderBy: [{ order: "asc" }],
    include: { tags: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Research"
        description="Manage research notes and write-ups."
        href="/admin/research/new"
        ctaLabel="New research entry"
      />

      <DataTable
        data={items}
        searchPlaceholder="Search research..."
        emptyMessage="No research entries yet."
        columns={[
          {
            key: "title",
            header: "Title",
            searchable: true,
            cell: (e) => (
              <div>
                <p className="font-medium">{e.title}</p>
                {e.summary ? (
                  <p className="text-xs text-muted-foreground">{truncate(e.summary, 120)}</p>
                ) : null}
              </div>
            ),
          },
          {
            key: "venue",
            header: "Venue",
            cell: (e) => (
              <div className="text-sm">
                {e.authorPosition ? <p className="font-medium">{e.authorPosition}</p> : null}
                {(e.conference || e.institution) ? (
                  <p className="text-xs text-muted-foreground">
                    {[e.conference, e.institution].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {!e.authorPosition && !e.conference && !e.institution ? (
                  <span className="text-muted-foreground">—</span>
                ) : null}
              </div>
            ),
          },
          {
            key: "tags",
            header: "Tags",
            cell: (e) =>
              e.tags.length ? (
                <div className="flex flex-wrap gap-1">
                  {e.tags.slice(0, 3).map((t) => (
                    <Badge key={t.id} variant="secondary">
                      {t.name}
                    </Badge>
                  ))}
                  {e.tags.length > 3 ? (
                    <Badge variant="outline">+{e.tags.length - 3}</Badge>
                  ) : null}
                </div>
              ) : (
                <span className="text-muted-foreground">—</span>
              ),
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
                <Button asChild variant="ghost" size="icon" aria-label="Edit research entry">
                  <Link href={`/admin/research/${e.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteButton
                  onDelete={async () => {
                    const res = await deleteResearchAction(e.id);
                    return { ok: res.ok };
                  }}
                  confirmTitle="Delete this research entry?"
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
