import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ExperienceForm } from "@/components/admin/forms/experience-form";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/experience">
          <ChevronLeft className="h-4 w-4" />
          Back to experience
        </Link>
      </Button>
      <AdminPageHeader title={item.role} />
      <ExperienceForm record={{ ...item } as unknown as Record<string, unknown>} />
    </div>
  );
}
