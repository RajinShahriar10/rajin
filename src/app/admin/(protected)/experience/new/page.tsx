import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ExperienceForm } from "@/components/admin/forms/experience-form";

export default function NewExperiencePage() {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/experience">
          <ChevronLeft className="h-4 w-4" />
          Back to experience
        </Link>
      </Button>
      <AdminPageHeader title="New experience" />
      <ExperienceForm />
    </div>
  );
}
