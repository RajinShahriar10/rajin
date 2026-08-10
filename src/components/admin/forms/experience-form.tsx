"use client";

import { EntityForm, type EntityField } from "@/components/admin/entity-form";
import {
  createExperienceAction,
  updateExperienceAction,
} from "@/lib/admin/actions";

const fields: EntityField[] = [
  { name: "role", label: "Role / title", kind: "text", placeholder: "Senior Software Engineer" },
  { name: "company", label: "Company", kind: "text", placeholder: "Acme Corp" },
  { name: "location", label: "Location", kind: "text", placeholder: "Dhaka, Bangladesh" },
  { name: "startDate", label: "Start date", kind: "date" },
  { name: "endDate", label: "End date", kind: "date", description: "Leave empty if currently employed." },
  { name: "current", label: "Currently working here", kind: "switch" },
  { name: "description", label: "Description (markdown)", kind: "textarea", rows: 6 },
  { name: "technologies", label: "Technologies", kind: "text", placeholder: "React, Node.js, PostgreSQL" },
  { name: "order", label: "Sort order", kind: "number" },
  { name: "visible", label: "Visible on the site", kind: "switch" },
];

export function ExperienceForm({ record }: { record?: Record<string, unknown> }) {
  return (
    <EntityForm
      fields={fields}
      record={record}
      submitLabel={record ? "Save experience" : "Create experience"}
      cancelHref="/admin/experience"
      submit={(values) =>
        record
          ? updateExperienceAction(record.id as string, values)
          : createExperienceAction(values)
      }
    />
  );
}
