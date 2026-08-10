import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/forms/profile-form";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findUnique({ where: { id: "main" } });

  return (
    <div>
      <AdminPageHeader
        title="Profile"
        description="Your name, biography, photo and contact details."
      />
      <ProfileForm profile={profile} />
    </div>
  );
}
