"use client";

import { EntityForm, type EntityField } from "@/components/admin/entity-form";
import {
  createEducationAction,
  updateEducationAction,
} from "@/lib/admin/actions";

const fields: EntityField[] = [
  { name: "degree", label: "Degree / program", kind: "text", placeholder: "B.Sc. in Computer Science" },
  { name: "institution", label: "Institution", kind: "text", placeholder: "University of Dhaka" },
  { name: "location", label: "Location", kind: "text", placeholder: "Dhaka, Bangladesh" },
  { name: "startYear", label: "Start year", kind: "text", placeholder: "2020" },
  { name: "endYear", label: "End year", kind: "text", placeholder: "2024" },
  { name: "current", label: "Currently enrolled", kind: "switch" },
  { name: "score", label: "GPA / result", kind: "text", placeholder: "3.85 / 4.00" },
  { name: "description", label: "Description (markdown)", kind: "textarea", rows: 4 },
  { name: "order", label: "Sort order", kind: "number" },
  { name: "visible", label: "Visible on the site", kind: "switch" },
];

export function EducationForm({ record }: { record?: Record<string, unknown> }) {
  return (
    <EntityForm
      fields={fields}
      record={record}
      submitLabel={record ? "Save education" : "Create education"}
      cancelHref="/admin/education"
      submit={(values) =>
        record
          ? updateEducationAction(record.id as string, values)
          : createEducationAction(values)
      }
    />
  );
}
