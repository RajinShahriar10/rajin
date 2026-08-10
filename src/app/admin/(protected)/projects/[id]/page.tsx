import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/forms/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      technologies: { orderBy: { order: "asc" } },
      images: { orderBy: { order: "asc" } },
      features: { orderBy: { order: "asc" } },
      metrics: { orderBy: { order: "asc" } },
      challenges: { orderBy: { order: "asc" } },
      solutions: { orderBy: { order: "asc" } },
    },
  });

  if (!project) notFound();

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/projects">
          <ChevronLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </Button>
      <AdminPageHeader
        title={project.title}
        description="Edit project case study."
      />
      <ProjectForm project={project} />
    </div>
  );
}
