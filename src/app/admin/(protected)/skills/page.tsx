import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: [{ order: "asc" }],
    include: { skills: { orderBy: [{ order: "asc" }, { name: "asc" }] } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Organize skills into categories and set proficiency levels."
      />
      <SkillsManager categories={categories} />
    </div>
  );
}
