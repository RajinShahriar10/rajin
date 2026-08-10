import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEducationAction } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminEducationPage() {
  const items = await prisma.education.findMany({ orderBy: [{ order: "asc" }] });

  return (
    <div>
      <AdminPageHeader
        title="Education"
        description="Manage your academic background."
        href="/admin/education/new"
        ctaLabel="New education"
      />

      <DataTable
        data={items}
        searchPlaceholder="Search degrees..."
        emptyMessage="No education entries yet."
        columns={[
          {
            key: "degree",
            header: "Degree",
            searchable: true,
            cell: (e) => (
              <div>
                <p className="font-medium">{e.degree}</p>
                <p className="text-xs text-muted-foreground">{e.institution}</p>
              </div>
            ),
          },
          {
            key: "years",
            header: "Years",
            cell: (e) =>
              e.current ? (
                <Badge variant="outline" className="border-primary/40 text-primary">
                  Current
                </Badge>
              ) : (
                <span className="text-muted-foreground">
                  {e.startYear ?? "—"} – {e.endYear ?? "Present"}
                </span>
              ),
          },
          {
            key: "score",
            header: "Result",
            cell: (e) => e.score ?? "—",
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
                <Button asChild variant="ghost" size="icon" aria-label="Edit education">
                  <Link href={`/admin/education/${e.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteButton
                  onDelete={async () => {
                    const res = await deleteEducationAction(e.id);
                    return { ok: res.ok };
                  }}
                  confirmTitle="Delete this education entry?"
                  confirmDescription={`"${e.degree} at ${e.institution}" will be permanently removed.`}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
