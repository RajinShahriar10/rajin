import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const [settings, sections] = await Promise.all([
    prisma.siteSetting.findMany({ orderBy: { key: "asc" } }),
    prisma.sectionSetting.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Site-wide settings and section visibility."
      />
      <SettingsForm settings={settings} sections={sections} />
    </div>
  );
}
