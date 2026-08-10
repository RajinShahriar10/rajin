import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCertificateAction } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function AdminCertificatesPage() {
  const items = await prisma.certificate.findMany({ orderBy: [{ order: "asc" }] });

  return (
    <div>
      <AdminPageHeader
        title="Certificates"
        description="Manage your certificates and credentials."
        href="/admin/certificates/new"
        ctaLabel="New certificate"
      />

      <DataTable
        data={items}
        searchPlaceholder="Search certificates..."
        emptyMessage="No certificates yet."
        columns={[
          {
            key: "title",
            header: "Title",
            searchable: true,
            cell: (e) => (
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.issuer}</p>
              </div>
            ),
          },
          {
            key: "issueDate",
            header: "Issue date",
            cell: (e) => formatDate(e.issueDate) || "—",
            className: "text-muted-foreground",
          },
          {
            key: "credentialId",
            header: "Credential ID",
            cell: (e) => e.credentialId ?? "—",
            className: "font-mono text-xs text-muted-foreground",
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
                <Button asChild variant="ghost" size="icon" aria-label="Edit certificate">
                  <Link href={`/admin/certificates/${e.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteButton
                  onDelete={async () => {
                    const res = await deleteCertificateAction(e.id);
                    return { ok: res.ok };
                  }}
                  confirmTitle="Delete this certificate?"
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
