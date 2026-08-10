import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AchievementForm } from "@/components/admin/forms/achievement-form";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.achievement.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/achievements">
          <ChevronLeft className="h-4 w-4" />
          Back to achievements
        </Link>
      </Button>
      <AdminPageHeader title={item.title} />
      <AchievementForm record={{ ...item } as unknown as Record<string, unknown>} />
    </div>
  );
}
