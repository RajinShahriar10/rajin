"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { MediaPicker } from "@/components/admin/media-picker";

type FieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
};

function toDateInput(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

export function MediaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  entityType,
}: FieldProps<T> & { entityType?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MediaPicker
              value={field.value ?? ""}
              onChange={field.onChange}
              entityType={entityType}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
}: FieldProps<T> & { type?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} value={field.value ?? ""} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextAreaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  rows = 4,
}: FieldProps<T> & { rows?: number }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={placeholder}
              className="font-mono text-sm"
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: FieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between gap-4 rounded-md border border-border bg-muted/30 px-4 py-3">
          <div>
            <FormLabel>{label}</FormLabel>
            {description ? <FormDescription>{description}</FormDescription> : null}
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={field.disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DateField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
}: FieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder={placeholder}
              value={toDateInput(field.value)}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={String(name)}
              disabled={field.disabled}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
}: FieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={String(name)}
              disabled={field.disabled}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormActions({
  pending,
  onCancel,
  submitLabel = "Save changes",
}: {
  pending: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
      {onCancel ? (
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}

export function Repeater<T extends FieldValues>({
  control,
  name,
  children,
  addLabel,
  addDefaults,
  max = 50,
}: {
  control: Control<T>;
  name: Path<T>;
  children: (field: { index: number; remove: () => void }) => React.ReactNode;
  addLabel: string;
  addDefaults: () => Record<string, unknown>;
  max?: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
          No items yet.
        </p>
      ) : null}
      {fields.map((field, index) => (
        <div key={field.id} className="relative rounded-md border border-border bg-muted/20 p-4">
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label={`Remove item ${index + 1}`}
            className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {children({ index, remove: () => remove(index) })}
        </div>
      ))}
      {fields.length < max ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(addDefaults() as never)}
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { Label };
