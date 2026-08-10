"use client";

import { EntityForm, type EntityField } from "@/components/admin/entity-form";
import {
  createCertificateAction,
  updateCertificateAction,
} from "@/lib/admin/actions";

const fields: EntityField[] = [
  { name: "title", label: "Title", kind: "text", placeholder: "AWS Certified Solutions Architect" },
  { name: "issuer", label: "Issuer", kind: "text", placeholder: "Amazon Web Services" },
  { name: "issueDate", label: "Issue date", kind: "date" },
  { name: "imageUrl", label: "Image / logo", kind: "media", entityType: "certificate" },
  { name: "imageAlt", label: "Image alt text", kind: "text", placeholder: "AWS Certified Solutions Architect badge" },
  { name: "credentialId", label: "Credential ID", kind: "text", placeholder: "ABCD-1234" },
  { name: "url", label: "Credential URL", kind: "text", placeholder: "https://..." },
  { name: "description", label: "Description", kind: "textarea", rows: 3 },
  { name: "order", label: "Sort order", kind: "number" },
  { name: "visible", label: "Visible on the site", kind: "switch" },
];

export function CertificateForm({ record }: { record?: Record<string, unknown> }) {
  return (
    <EntityForm
      fields={fields}
      record={record}
      submitLabel={record ? "Save certificate" : "Create certificate"}
      cancelHref="/admin/certificates"
      submit={(values) =>
        record
          ? updateCertificateAction(record.id as string, values)
          : createCertificateAction(values)
      }
    />
  );
}
