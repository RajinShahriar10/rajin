"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { profileSchema } from "@/lib/validation";
import { updateProfileAction } from "@/lib/admin/actions";
import { useServerAction } from "@/components/admin/use-server-action";
import {
  FormActions,
  MediaField,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";

type ProfileValues = z.input<typeof profileSchema>;

export function ProfileForm({
  profile,
}: {
  profile: {
    name: string | null;
    title: string | null;
    tagline: string | null;
    summary: string | null;
    bio: string | null;
    profileImageUrl: string | null;
    profileImageAlt: string | null;
    resumeUrl: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    website: string | null;
    availability: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  } | null;
}) {
  const router = useRouter();
  const { pending, run } = useServerAction();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      title: profile?.title ?? "",
      tagline: profile?.tagline ?? "",
      summary: profile?.summary ?? "",
      bio: profile?.bio ?? "",
      profileImageUrl: profile?.profileImageUrl ?? "",
      profileImageAlt: profile?.profileImageAlt ?? "",
      resumeUrl: profile?.resumeUrl ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      location: profile?.location ?? "",
      website: profile?.website ?? "",
      availability: profile?.availability ?? "",
      seoTitle: profile?.seoTitle ?? "",
      seoDescription: profile?.seoDescription ?? "",
    },
  });

  async function onSubmit(values: ProfileValues) {
    await run(() => updateProfileAction(values), {
      success: "Profile saved.",
      onSuccess: () => router.refresh(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Basics</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={form.control} name="name" label="Full name" />
            <TextField control={form.control} name="title" label="Professional title" />
            <div className="sm:col-span-2">
              <TextField control={form.control} name="tagline" label="Tagline" />
            </div>
            <div className="sm:col-span-2">
              <TextAreaField control={form.control} name="summary" label="Summary" rows={3} />
            </div>
            <div className="sm:col-span-2">
              <TextAreaField
                control={form.control}
                name="bio"
                label="Biography (markdown)"
                rows={10}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Photo & resume</h2>
          <div className="grid gap-5">
            <MediaField
              control={form.control}
              name="profileImageUrl"
              label="Profile image"
            />
            <TextField control={form.control} name="profileImageAlt" label="Image alt text" />
            <MediaField control={form.control} name="resumeUrl" label="Resume file" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Contact details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={form.control} name="email" label="Email" type="email" />
            <TextField control={form.control} name="phone" label="Phone" />
            <TextField control={form.control} name="location" label="Location" />
            <TextField control={form.control} name="website" label="Website" />
            <TextField control={form.control} name="availability" label="Availability" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">SEO</h2>
          <div className="grid gap-5">
            <TextField control={form.control} name="seoTitle" label="SEO title" />
            <TextAreaField control={form.control} name="seoDescription" label="SEO description" rows={2} />
          </div>
        </div>

        <FormActions pending={pending} submitLabel="Save profile" />
      </form>
    </Form>
  );
}
