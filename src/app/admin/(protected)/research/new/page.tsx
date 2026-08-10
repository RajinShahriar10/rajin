import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ResearchForm } from "@/components/admin/forms/research-form";

export default function NewResearchPage() {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/research">
          <ChevronLeft className="h-4 w-4" />
          Back to research
        </Link>
      </Button>
      <AdminPageHeader title="New research entry" />
      <ResearchForm />
    </div>
  );
}
