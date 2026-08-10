"use client";

import { useState } from "react";
import {
  EntityForm,
  RepeaterField,
  type EntityField,
} from "@/components/admin/entity-form";
import {
  createResearchAction,
  updateResearchAction,
} from "@/lib/admin/actions";

const fields: EntityField[] = [
  { name: "title", label: "Title", kind: "text", placeholder: "Comparative analysis of modern auth flows" },
  { name: "category", label: "Category", kind: "text", placeholder: "Conference paper / Journal / Notes" },
  { name: "authorPosition", label: "Author position", kind: "text", placeholder: "Lead Author" },
  { name: "conference", label: "Conference / journal", kind: "text", placeholder: "ICSE 2024" },
  { name: "institution", label: "Institution", kind: "text", placeholder: "American International University-Bangladesh" },
  { name: "imageUrl", label: "Image", kind: "media", entityType: "research" },
  { name: "imageAlt", label: "Image alt text", kind: "text", placeholder: "Cover image for this research note" },
  { name: "date", label: "Date", kind: "date" },
  { name: "url", label: "Link (paper / repo)", kind: "text", placeholder: "https://..." },
  { name: "summary", label: "Abstract / summary", kind: "textarea", rows: 4 },
  { name: "details", label: "Details (markdown)", kind: "textarea", rows: 8 },
  { name: "order", label: "Sort order", kind: "number" },
  { name: "visible", label: "Visible on the site", kind: "switch" },
];

export function ResearchForm({ record }: { record?: Record<string, unknown> }) {
  const [tags, setTags] = useState<string[]>(
    Array.isArray(record?.tags)
      ? (record.tags as Array<{ name?: string }>).map((t) => t.name ?? "")
      : [],
  );

  return (
    <EntityForm
      fields={fields}
      record={record}
      submitLabel={record ? "Save research" : "Create research"}
      cancelHref="/admin/research"
      submit={(values) => {
        const payload = {
          ...values,
          tags: tags.filter(Boolean).map((name) => ({ name })),
        };
        return record
          ? updateResearchAction(record.id as string, payload)
          : createResearchAction(payload);
      }}
    >
      <div className="rounded-lg border border-border bg-card p-6">
        <RepeaterField
          label="Tags"
          fieldLabel="tag"
          value={tags}
          onChange={setTags}
        />
      </div>
    </EntityForm>
  );
}
