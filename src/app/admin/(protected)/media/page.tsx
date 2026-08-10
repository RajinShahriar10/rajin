import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MediaManager } from "@/components/admin/media-manager";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <AdminPageHeader
        title="Media"
        description="Upload and manage images used across the site."
      />
      <MediaManager initial={media} />
    </div>
  );
}
