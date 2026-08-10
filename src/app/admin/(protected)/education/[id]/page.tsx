import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EducationForm } from "@/components/admin/forms/education-form";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.education.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/education">
          <ChevronLeft className="h-4 w-4" />
          Back to education
        </Link>
      </Button>
      <AdminPageHeader title={item.degree} />
      <EducationForm record={{ ...item } as unknown as Record<string, unknown>} />
    </div>
  );
}
