import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/forms/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/projects">
          <ChevronLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </Button>
      <AdminPageHeader
        title="New project"
        description="Add a new project case study."
      />
      <ProjectForm />
    </div>
  );
}
