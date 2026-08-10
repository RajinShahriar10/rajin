"use client";

import { useRouter } from "next/navigation";
import { useForm, type FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { heroSchema } from "@/lib/validation";
import { zr } from "@/lib/validation/resolver";
import { updateHeroAction } from "@/lib/admin/actions";
import { useServerAction } from "@/components/admin/use-server-action";
import {
  FormActions,
  MediaField,
  Repeater,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function HeroForm({
  hero,
}: {
  hero: {
    eyebrow: string | null;
    headline: string;
    subheadline: string | null;
    description: string | null;
    primaryCtaLabel: string | null;
    primaryCtaHref: string | null;
    secondaryCtaLabel: string | null;
    secondaryCtaHref: string | null;
    profileImageUrl: string | null;
    profileImageAlt: string | null;
    background: string | null;
    stats: Array<{ id: string; label: string; value: string; order: number }>;
  } | null;
}) {
  const router = useRouter();
  const { pending, run } = useServerAction();

  const form = useForm<FieldValues>({
    resolver: zr(heroSchema),
    defaultValues: {
      eyebrow: hero?.eyebrow ?? "",
      headline: hero?.headline ?? "Building secure software",
      subheadline: hero?.subheadline ?? "",
      description: hero?.description ?? "",
      primaryCtaLabel: hero?.primaryCtaLabel ?? "",
      primaryCtaHref: hero?.primaryCtaHref ?? "",
      secondaryCtaLabel: hero?.secondaryCtaLabel ?? "",
      secondaryCtaHref: hero?.secondaryCtaHref ?? "",
      profileImageUrl: hero?.profileImageUrl ?? "",
      profileImageAlt: hero?.profileImageAlt ?? "",
      background: hero?.background ?? "grid",
      stats: hero?.stats ?? [],
    },
  });

  async function onSubmit(values: FieldValues) {
    await run(() => updateHeroAction(values), {
      success: "Hero saved.",
      onSuccess: () => router.refresh(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Content</h2>
          <div className="grid gap-5">
            <TextField control={form.control} name="eyebrow" label="Eyebrow" />
            <TextField control={form.control} name="headline" label="Headline" />
            <TextField control={form.control} name="subheadline" label="Subheadline" />
            <TextAreaField control={form.control} name="description" label="Description" rows={3} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Call to action</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField control={form.control} name="primaryCtaLabel" label="Primary CTA label" />
            <TextField control={form.control} name="primaryCtaHref" label="Primary CTA link" />
            <TextField control={form.control} name="secondaryCtaLabel" label="Secondary CTA label" />
            <TextField control={form.control} name="secondaryCtaHref" label="Secondary CTA link" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Visuals</h2>
          <div className="grid gap-5">
            <MediaField control={form.control} name="profileImageUrl" label="Profile image" />
            <TextField control={form.control} name="profileImageAlt" label="Image alt text" />
            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? "grid"} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Select background" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">3D grid</SelectItem>
                        <SelectItem value="particles">Particles</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Stats</h2>
          <Repeater
            control={form.control}
            name="stats"
            addLabel="Add stat"
            addDefaults={() => ({ id: undefined, label: "", value: "", order: 0 })}
          >
            {({ index }) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                <FormField
                  control={form.control}
                  name={`stats.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Label (e.g. Years experience)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`stats.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Value (e.g. 3+)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </Repeater>
        </div>

        <FormActions pending={pending} submitLabel="Save hero" />
      </form>
    </Form>
  );
}
