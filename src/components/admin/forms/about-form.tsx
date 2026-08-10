"use client";

import { useRouter } from "next/navigation";
import { useForm, type FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { aboutSchema } from "@/lib/validation";
import { zr } from "@/lib/validation/resolver";
import { updateAboutAction } from "@/lib/admin/actions";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function AboutForm({
  about,
}: {
  about: {
    heading: string;
    content: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
    resumeUrl: string | null;
    stats: Array<{ id: string; label: string; value: string; order: number }>;
    principles: Array<{
      id: string;
      title: string;
      summary: string;
      order: number;
    }>;
  } | null;
}) {
  const router = useRouter();
  const { pending, run } = useServerAction();

  const form = useForm<FieldValues>({
    resolver: zr(aboutSchema),
    defaultValues: {
      heading: about?.heading ?? "About Me",
      content: about?.content ?? "",
      imageUrl: about?.imageUrl ?? "",
      imageAlt: about?.imageAlt ?? "",
      resumeUrl: about?.resumeUrl ?? "",
      stats: about?.stats ?? [],
      principles: about?.principles ?? [],
    },
  });

  async function onSubmit(values: FieldValues) {
    await run(() => updateAboutAction(values), {
      success: "About section saved.",
      onSuccess: () => router.refresh(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Content</h2>
          <div className="grid gap-5">
            <TextField control={form.control} name="heading" label="Heading" />
            <TextAreaField
              control={form.control}
              name="content"
              label="Content (markdown)"
              rows={10}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Visuals</h2>
          <div className="grid gap-5">
            <MediaField control={form.control} name="imageUrl" label="Image" />
            <TextField control={form.control} name="imageAlt" label="Image alt text" />
            <MediaField control={form.control} name="resumeUrl" label="Resume file" />
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
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`stats.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Label" {...field} />
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
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </Repeater>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Principles</h2>
          <Repeater
            control={form.control}
            name="principles"
            addLabel="Add principle"
            addDefaults={() => ({ id: undefined, title: "", summary: "", order: 0 })}
          >
            {({ index }) => (
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name={`principles.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Principle title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`principles.${index}.summary`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="One-line summary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </Repeater>
        </div>

        <FormActions pending={pending} submitLabel="Save about section" />
      </form>
    </Form>
  );
}
