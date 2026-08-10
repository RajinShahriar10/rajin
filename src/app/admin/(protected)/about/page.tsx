import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AboutForm } from "@/components/admin/forms/about-form";

export default async function AdminAboutPage() {
  const about = await prisma.about.findUnique({
    where: { id: "main" },
    include: {
      stats: { orderBy: { order: "asc" } },
      principles: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div>
      <AdminPageHeader
        title="About"
        description="The about section shown on the homepage and the /about page."
      />
      <AboutForm about={about} />
    </div>
  );
}
