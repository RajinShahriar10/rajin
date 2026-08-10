import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { HeroForm } from "@/components/admin/forms/hero-form";

export default async function AdminHeroPage() {
  const hero = await prisma.hero.findUnique({
    where: { id: "main" },
    include: { stats: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Hero"
        description="The homepage hero section — headline, CTAs, visuals and stats."
      />
      <HeroForm hero={hero} />
    </div>
  );
}
