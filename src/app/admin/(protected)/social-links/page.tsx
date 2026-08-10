import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SocialLinksManager } from "@/components/admin/social-links-manager";

export default async function AdminSocialLinksPage() {
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Social Links"
        description="Manage the social and external links shown on the site."
      />
      <SocialLinksManager links={socialLinks} />
    </div>
  );
}
