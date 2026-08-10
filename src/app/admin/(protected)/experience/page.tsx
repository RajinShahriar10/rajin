import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteExperienceAction } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function AdminExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: [{ order: "asc" }] });

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        description="Manage your work experience timeline."
        href="/admin/experience/new"
        ctaLabel="New experience"
      />

      <DataTable
        data={items}
        searchPlaceholder="Search roles..."
        emptyMessage="No experience entries yet."
        columns={[
          {
            key: "role",
            header: "Role",
            searchable: true,
            cell: (e) => (
              <div>
                <p className="font-medium">{e.role}</p>
                <p className="text-xs text-muted-foreground">{e.company}</p>
              </div>
            ),
          },
          {
            key: "dates",
            header: "Dates",
            cell: (e) => (
              <span className="text-muted-foreground">
                {e.current ? (
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    Current
                  </Badge>
                ) : (
                  `${formatDate(e.startDate)} – ${formatDate(e.endDate) || "Present"}`
                )}
              </span>
            ),
          },
          {
            key: "location",
            header: "Location",
            cell: (e) => e.location ?? "—",
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
                <Button asChild variant="ghost" size="icon" aria-label="Edit experience">
                  <Link href={`/admin/experience/${e.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteButton
                  onDelete={async () => {
                    const res = await deleteExperienceAction(e.id);
                    return { ok: res.ok };
                  }}
                  confirmTitle="Delete this experience entry?"
                  confirmDescription={`"${e.role} at ${e.company}" will be permanently removed.`}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
