import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AchievementForm } from "@/components/admin/forms/achievement-form";

export default function NewAchievementPage() {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/achievements">
          <ChevronLeft className="h-4 w-4" />
          Back to achievements
        </Link>
      </Button>
      <AdminPageHeader title="New achievement" />
      <AchievementForm />
    </div>
  );
}
