"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { changePasswordSchema } from "@/lib/validation";
import { changePasswordAction } from "@/lib/admin/actions";
import { useServerAction } from "@/components/admin/use-server-action";
import { TextField } from "@/components/admin/form-fields";
import { FormActions } from "@/components/admin/form-fields";

export function AccountForm({ email }: { email: string }) {
  const router = useRouter();
  const { pending, run } = useServerAction();

  const form = useForm<z.input<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.input<typeof changePasswordSchema>) {
    await run(
      () => changePasswordAction({ ...values, newPassword: values.newPassword ?? "" }),
      {
        success: "Password updated.",
        onSuccess: () => {
          form.reset();
          router.refresh();
        },
      },
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Change password</h2>
            <div className="grid gap-5">
              <TextField
                control={form.control}
                name="currentPassword"
                label="Current password"
                type="password"
              />
              <TextField
                control={form.control}
                name="newPassword"
                label="New password"
                type="password"
                description="At least 8 characters."
              />
              <TextField
                control={form.control}
                name="confirmPassword"
                label="Confirm new password"
                type="password"
              />
            </div>
          </div>
          <FormActions pending={pending} submitLabel="Update password" />
        </form>
      </Form>

      <div className="h-fit rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 font-display text-sm font-semibold">Account</h2>
        <p className="break-all text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
