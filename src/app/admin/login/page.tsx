import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin/dashboard");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/30 bg-accent-soft">
            <Shield className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Admin sign in
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage the portfolio CMS.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Credentials are set via ADMIN_EMAIL / ADMIN_PASSWORD during seeding.
        </p>
      </div>
    </div>
  );
}
