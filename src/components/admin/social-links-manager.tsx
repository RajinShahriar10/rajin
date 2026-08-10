"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSocialLinkAction,
  updateSocialLinkAction,
} from "@/lib/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSocialLinkAction } from "@/lib/admin/actions";
import { SOCIAL_PLATFORMS } from "@/lib/constants";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  label: string | null;
  order: number;
  visible: boolean;
};

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<SocialLink[]>(links);
  const [pending, setPending] = useState(false);

  const [adding, setAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState("github");
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");

  function updateRow(id: string, patch: Partial<SocialLink>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function addLink() {
    if (!newUrl.trim()) return;
    setPending(true);
    try {
      const res = await createSocialLinkAction({
        platform: newPlatform,
        url: newUrl,
        label: newLabel || undefined,
        order: rows.length,
        visible: true,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Link added.");
      setNewUrl("");
      setNewLabel("");
      setAdding(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  async function saveAll() {
    setPending(true);
    try {
      const results = await Promise.all(
        rows.map((row) =>
          updateSocialLinkAction(row.id, {
            platform: row.platform,
            url: row.url,
            label: row.label || undefined,
            order: row.order,
            visible: row.visible,
          }),
        ),
      );
      if (results.some((r) => !r.ok)) {
        toast.error("Failed to save some links.");
        return;
      }
      toast.success("Links saved.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Social links</h2>
        <div className="space-y-3">
          {rows.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No social links yet.
            </p>
          ) : (
            rows.map((row, index) => (
              <div
                key={row.id}
                className="grid gap-2 rounded-md border border-border bg-muted/20 p-3 sm:grid-cols-[140px_1fr_1fr_auto_auto]"
              >
                <div>
                  <Label htmlFor={`platform-${row.id}`} className="mb-1 block text-xs">
                    Platform
                  </Label>
                  <select
                    id={`platform-${row.id}`}
                    value={row.platform}
                    onChange={(e) => updateRow(row.id, { platform: e.target.value })}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor={`url-${row.id}`} className="mb-1 block text-xs">
                    URL
                  </Label>
                  <Input
                    id={`url-${row.id}`}
                    className="font-mono text-sm"
                    value={row.url}
                    onChange={(e) => updateRow(row.id, { url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`label-${row.id}`} className="mb-1 block text-xs">
                    Label
                  </Label>
                  <Input
                    id={`label-${row.id}`}
                    value={row.label ?? ""}
                    onChange={(e) =>
                      updateRow(row.id, { label: e.target.value || null })
                    }
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() =>
                      setRows((prev) => {
                        const next = [...prev];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next.map((r, i) => ({ ...r, order: i }));
                      })
                    }
                  >
                    Up
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === rows.length - 1}
                    onClick={() =>
                      setRows((prev) => {
                        const next = [...prev];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        return next.map((r, i) => ({ ...r, order: i }));
                      })
                    }
                  >
                    Down
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <DeleteButton
                    onDelete={async () => {
                      const res = await deleteSocialLinkAction(row.id);
                      return { ok: res.ok };
                    }}
                    confirmTitle="Delete this social link?"
                    confirmDescription={`${row.platform} link will be removed.`}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {adding ? (
          <div className="mt-4 grid gap-3 rounded-md border border-border bg-muted/20 p-4 sm:grid-cols-[140px_1fr_1fr_auto]">
            <div>
              <Label htmlFor="new-platform" className="mb-1 block text-xs">
                Platform
              </Label>
              <select
                id="new-platform"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="new-url" className="mb-1 block text-xs">
                URL
              </Label>
              <Input
                id="new-url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <Label htmlFor="new-label" className="mb-1 block text-xs">
                Label
              </Label>
              <Input
                id="new-label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="GitHub"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button size="sm" onClick={addLink} disabled={pending}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setAdding(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add link
          </Button>
        )}
      </div>

      <div className="mt-6 flex justify-end border-t border-border pt-6">
        <Button onClick={saveAll} disabled={pending || rows.length === 0}>
          {pending ? null : <Save className="h-4 w-4" />}
          {pending ? "Saving..." : "Save all changes"}
        </Button>
      </div>
    </div>
  );
}
