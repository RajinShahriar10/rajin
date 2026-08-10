import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EducationForm } from "@/components/admin/forms/education-form";

export default function NewEducationPage() {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/education">
          <ChevronLeft className="h-4 w-4" />
          Back to education
        </Link>
      </Button>
      <AdminPageHeader title="New education" />
      <EducationForm />
    </div>
  );
}
