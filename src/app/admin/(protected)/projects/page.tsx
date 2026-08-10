import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProjectAction } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }],
    include: { _count: { select: { technologies: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Create and manage project case studies."
        href="/admin/projects/new"
        ctaLabel="New project"
      />

      <DataTable
        data={projects}
        searchPlaceholder="Search projects..."
        emptyMessage="No projects yet. Create your first project."
        columns={[
          {
            key: "title",
            header: "Title",
            searchable: true,
            searchValue: (p) => [p.title, p.slug, p.category, p.status].filter(Boolean).join(" "),
            cell: (p) => (
              <div className="flex items-center gap-3">
                {p.primaryImageUrl ? (
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded border border-border">
                    <Image
                      src={p.primaryImageUrl}
                      alt={p.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-14 shrink-0 rounded border border-border bg-muted/40" />
                )}
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">/{p.slug}</p>
                </div>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            cell: (p) => p.category ?? "—",
          },
          {
            key: "status",
            header: "Status",
            cell: (p) => (
              <div className="flex items-center gap-2">
                {p.featured ? (
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    Featured
                  </Badge>
                ) : null}
                {!p.published ? (
                  <Badge variant="secondary">Draft</Badge>
                ) : (
                  <span className="text-muted-foreground">{p.status}</span>
                )}
              </div>
            ),
          },
          {
            key: "order",
            header: "Order",
            cell: (p) => p.order,
            className: "text-muted-foreground",
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (p) => (
              <div className="flex items-center justify-end gap-1">
                <Button asChild variant="ghost" size="icon" aria-label="Edit project">
                  <Link href={`/admin/projects/${p.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteButton
                  action={deleteProjectAction}
                  id={p.id}
                  confirmTitle="Delete this project?"
                  confirmDescription={`"${p.title}" and all its details will be permanently removed.`}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
