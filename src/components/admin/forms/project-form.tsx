"use client";

import { useRouter } from "next/navigation";
import { useForm, type FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { projectSchema } from "@/lib/validation";
import { zr } from "@/lib/validation/resolver";
import { createProjectAction, updateProjectAction } from "@/lib/admin/actions";
import { useServerAction } from "@/components/admin/use-server-action";
import {
  DateField,
  FormActions,
  MediaField,
  NumberField,
  Repeater,
  SwitchField,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { ProjectGalleryField } from "@/components/admin/project-gallery";

type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  featured: boolean;
  published: boolean;
  status: string | null;
  startDate: Date | null;
  completionDate: Date | null;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  videoUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  documentationUrl: string | null;
  role: string | null;
  teamSize: number | null;
  architecture: string | null;
  databaseInfo: string | null;
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
  technologies: Array<{ id: string; name: string }>;
  images: Array<{ id: string; url: string; alt: string | null; publicId: string | null }>;
  features: Array<{ id: string; content: string }>;
  metrics: Array<{ id: string; label: string; value: string }>;
  challenges: Array<{ id: string; content: string }>;
  solutions: Array<{ id: string; content: string }>;
};

export function ProjectForm({
  project,
}: {
  project?: ProjectRecord | null;
}) {
  const router = useRouter();
  const { pending, run } = useServerAction();
  const isEdit = Boolean(project);

  const form = useForm<FieldValues>({
    resolver: zr(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      shortDescription: project?.shortDescription ?? "",
      description: project?.description ?? "",
      category: project?.category ?? "",
      featured: project?.featured ?? false,
      published: project?.published ?? true,
      status: project?.status ?? "completed",
      startDate: project?.startDate ?? "",
      completionDate: project?.completionDate ?? "",
      primaryImageUrl: project?.primaryImageUrl ?? "",
      primaryImageAlt: project?.primaryImageAlt ?? "",
      videoUrl: project?.videoUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      liveUrl: project?.liveUrl ?? "",
      documentationUrl: project?.documentationUrl ?? "",
      role: project?.role ?? "",
      teamSize: project?.teamSize ?? "",
      architecture: project?.architecture ?? "",
      databaseInfo: project?.databaseInfo ?? "",
      order: project?.order ?? 0,
      seoTitle: project?.seoTitle ?? "",
      seoDescription: project?.seoDescription ?? "",
      technologies: project?.technologies ?? [],
      images: project?.images.map((img) => ({ ...img, alt: img.alt ?? "" })) ?? [],
      features: project?.features ?? [],
      metrics: project?.metrics ?? [],
      challenges: project?.challenges ?? [],
      solutions: project?.solutions ?? [],
    },
  });

  async function onSubmit(values: FieldValues) {
    await run(
      () => (isEdit ? updateProjectAction(project!.id, values) : createProjectAction(values)),
      {
        success: isEdit ? "Project updated." : "Project created.",
        onSuccess: () => router.push("/admin/projects"),
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Basics</h2>
          <div className="grid gap-5">
            <TextField control={form.control} name="title" label="Title" />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="project-slug" className="font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="self-end pb-1">
                <button
                  type="button"
                  onClick={() =>
                    form.setValue("slug", slugify(String(form.getValues("title") ?? "")), {
                      shouldValidate: true,
                    })
                  }
                  className="text-sm text-primary hover:opacity-80"
                >
                  Auto-generate from title
                </button>
              </div>
            </div>
            <TextAreaField
              control={form.control}
              name="shortDescription"
              label="Short description"
              rows={2}
            />
            <TextAreaField
              control={form.control}
              name="description"
              label="Full description (markdown)"
              rows={8}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <>
                        <Input list="project-categories" placeholder="Full-Stack Web" {...field} />
                        <datalist id="project-categories">
                          {PROJECT_CATEGORIES.map((c) => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? "completed"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DateField control={form.control} name="startDate" label="Start date" />
              <DateField control={form.control} name="completionDate" label="Completion date" />
              <TextField control={form.control} name="role" label="Your role" />
              <NumberField control={form.control} name="teamSize" label="Team size" />
              <NumberField control={form.control} name="order" label="Sort order" />
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SwitchField control={form.control} name="featured" label="Featured" description="Show in the homepage carousel." />
            <SwitchField control={form.control} name="published" label="Published" description="Visible on the public site." />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Media & links</h2>
          <div className="grid gap-5">
            <MediaField control={form.control} name="primaryImageUrl" label="Cover image" />
            <TextField control={form.control} name="primaryImageAlt" label="Cover image alt text" />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={form.control} name="videoUrl" label="Video URL" />
              <TextField control={form.control} name="liveUrl" label="Live site URL" />
              <TextField control={form.control} name="githubUrl" label="Source code URL" />
              <TextField control={form.control} name="documentationUrl" label="Documentation URL" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Case study</h2>
          <div className="grid gap-5">
            <TextAreaField
              control={form.control}
              name="architecture"
              label="Architecture (markdown)"
              rows={6}
            />
            <TextAreaField
              control={form.control}
              name="databaseInfo"
              label="Data & storage (markdown)"
              rows={6}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Technologies</h2>
          <Repeater
            control={form.control}
            name="technologies"
            addLabel="Add technology"
            addDefaults={() => ({ id: undefined, name: "", order: 0 })}
          >
            {({ index }) => (
              <FormField
                control={form.control}
                name={`technologies.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="ASP.NET Core 8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </Repeater>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Gallery images</h2>
          <ProjectGalleryField form={form} projectId={project?.id} />
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Key features</h2>
          <Repeater
            control={form.control}
            name="features"
            addLabel="Add feature"
            addDefaults={() => ({ id: undefined, content: "", order: 0 })}
          >
            {({ index }) => (
              <FormField
                control={form.control}
                name={`features.${index}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Feature description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </Repeater>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Metrics</h2>
          <Repeater
            control={form.control}
            name="metrics"
            addLabel="Add metric"
            addDefaults={() => ({ id: undefined, label: "", value: "", order: 0 })}
          >
            {({ index }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`metrics.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Label (e.g. Uptime)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`metrics.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Value (e.g. 99.9%)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </Repeater>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Challenges</h2>
            <Repeater
              control={form.control}
              name="challenges"
              addLabel="Add challenge"
              addDefaults={() => ({ id: undefined, content: "", order: 0 })}
            >
              {({ index }) => (
                <FormField
                  control={form.control}
                  name={`challenges.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Challenge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Repeater>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Solutions</h2>
            <Repeater
              control={form.control}
              name="solutions"
              addLabel="Add solution"
              addDefaults={() => ({ id: undefined, content: "", order: 0 })}
            >
              {({ index }) => (
                <FormField
                  control={form.control}
                  name={`solutions.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Solution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </Repeater>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">SEO</h2>
          <div className="grid gap-5">
            <TextField control={form.control} name="seoTitle" label="SEO title" />
            <TextAreaField control={form.control} name="seoDescription" label="SEO description" rows={2} />
          </div>
        </div>

        <FormActions
          pending={pending}
          submitLabel={isEdit ? "Save project" : "Create project"}
          onCancel={() => router.push("/admin/projects")}
        />
      </form>
    </Form>
  );
}
