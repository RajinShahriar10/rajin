"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/admin/media-picker";
import { FormActions } from "@/components/admin/form-fields";

export type EntityField = {
  name: string;
  label: string;
  kind: "text" | "textarea" | "date" | "number" | "switch" | "media";
  placeholder?: string;
  description?: string;
  rows?: number;
  /** Media library association recorded for media-kind fields. */
  entityType?: string;
};

type ActionResult = { ok: true } | { ok: false; error: string };

function toInputValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (value == null) return "";
  return String(value);
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: EntityField;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}) {
  if (field.kind === "switch") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/30 px-4 py-3">
        <div>
          <Label>{field.label}</Label>
          {field.description ? (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          ) : null}
        </div>
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(v) => onChange(field.name, v)}
        />
      </div>
    );
  }

  if (field.kind === "media") {
    return (
      <MediaPicker
        value={toInputValue(value)}
        onChange={(v) => onChange(field.name, v)}
        entityType={field.entityType}
      />
    );
  }

  const common = {
    id: field.name,
    placeholder: field.placeholder,
  };

  if (field.kind === "textarea") {
    return (
      <Textarea
        rows={field.rows ?? 4}
        className="font-mono text-sm"
        {...common}
        value={toInputValue(value)}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    );
  }

  return (
    <Input
      type={field.kind === "number" ? "number" : field.kind === "date" ? "date" : "text"}
      {...common}
      value={toInputValue(value)}
      onChange={(e) => onChange(field.name, e.target.value)}
    />
  );
}

export function EntityForm({
  fields,
  record,
  submit,
  submitLabel,
  cancelHref,
  children,
}: {
  fields: EntityField[];
  record?: Record<string, unknown>;
  submit: (values: Record<string, unknown>) => Promise<ActionResult>;
  submitLabel: string;
  cancelHref: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const f of fields) {
      initial[f.name] = record?.[f.name] ?? (f.kind === "switch" ? false : "");
    }
    return initial;
  });
  const [pending, setPending] = useState(false);

  function setValue(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await submit(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Saved.");
      router.push(cancelHref);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="grid gap-5">
          {fields.map((field) => (
            <div key={field.name}>
              {field.kind !== "switch" ? (
                <Label htmlFor={field.name} className="mb-1.5 block">
                  {field.label}
                </Label>
              ) : null}
              <FieldInput field={field} value={values[field.name]} onChange={setValue} />
              {field.description && field.kind !== "switch" ? (
                <p className="mt-1.5 text-xs text-muted-foreground">{field.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {children ? <div className="space-y-8">{children}</div> : null}

      <FormActions
        pending={pending}
        submitLabel={submitLabel}
        onCancel={() => router.push(cancelHref)}
      />
    </form>
  );
}

export function RepeaterField({
  label,
  fieldLabel,
  value,
  onChange,
}: {
  label: string;
  fieldLabel: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <div className="space-y-3">
        {value.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No items yet.
          </p>
        ) : null}
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              placeholder={fieldLabel}
              onChange={(e) => {
                const next = [...value];
                next[index] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`Remove ${fieldLabel}`}
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, ""])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add {fieldLabel}
        </Button>
      </div>
    </div>
  );
}
