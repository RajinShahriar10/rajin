import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AccountForm } from "@/components/admin/account-form";

export default async function AdminAccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div>
      <AdminPageHeader
        title="Account"
        description="Manage your admin account credentials."
      />
      <AccountForm email={session.user.email ?? "Signed in"} />
    </div>
  );
}
