"use client";

import { EntityForm, type EntityField } from "@/components/admin/entity-form";
import {
  createAchievementAction,
  updateAchievementAction,
} from "@/lib/admin/actions";

const fields: EntityField[] = [
  { name: "title", label: "Title", kind: "text", placeholder: "Runner-up, National Hackathon 2024" },
  { name: "category", label: "Category", kind: "text", placeholder: "academic / football / sports" },
  { name: "description", label: "Description", kind: "textarea", rows: 3 },
  { name: "date", label: "Date", kind: "date" },
  { name: "imageUrl", label: "Image (optional)", kind: "media", entityType: "achievement" },
  { name: "imageAlt", label: "Image alt text", kind: "text", placeholder: "Photo of the achievement" },
  { name: "order", label: "Sort order", kind: "number" },
  { name: "visible", label: "Visible on the site", kind: "switch" },
];

export function AchievementForm({ record }: { record?: Record<string, unknown> }) {
  return (
    <EntityForm
      fields={fields}
      record={record}
      submitLabel={record ? "Save achievement" : "Create achievement"}
      cancelHref="/admin/achievements"
      submit={(values) =>
        record
          ? updateAchievementAction(record.id as string, values)
          : createAchievementAction(values)
      }
    />
  );
}
