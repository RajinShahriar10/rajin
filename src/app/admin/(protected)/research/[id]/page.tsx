import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ResearchForm } from "@/components/admin/forms/research-form";

export default async function EditResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.research.findUnique({
    where: { id },
    include: { tags: { orderBy: { order: "asc" } } },
  });
  if (!item) notFound();

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/research">
          <ChevronLeft className="h-4 w-4" />
          Back to research
        </Link>
      </Button>
      <AdminPageHeader title={item.title} />
      <ResearchForm record={{ ...item } as unknown as Record<string, unknown>} />
    </div>
  );
}
