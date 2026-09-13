"use client";

import { useRef, useState } from "react";
import { FileCheck2, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PdfField({
  label,
  doc,
  value,
  onChange,
}: {
  label: string;
  doc: "resume" | "cv";
  value?: string | null;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const attached = Boolean(value);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be 10 MB or smaller.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch(`/api/documents/upload?doc=${doc}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Upload failed.");
      }
      onChange(`blob:${doc}`);
      toast.success("Uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setBusy(true);
    try {
      const res = await fetch(`/api/documents/upload?doc=${doc}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Remove failed.");
      onChange("");
      toast.success("Removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy ? "Uploading..." : "Upload PDF"}
        </Button>
        {attached ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileCheck2 className="h-3.5 w-3.5 text-primary" />
              PDF attached
            </span>
            <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={handleRemove}>
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}