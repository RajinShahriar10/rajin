"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormActions } from "@/components/admin/form-fields";
import { updateSettingsAction, updateSectionsAction } from "@/lib/admin/actions";

type SettingRow = { key: string; value: string; description: string | null };
type SectionRow = {
  key: string;
  label: string;
  visible: boolean;
  order: number;
};

export function SettingsForm({
  settings,
  sections,
}: {
  settings: SettingRow[];
  sections: SectionRow[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(settings.map((s) => [s.key, s.value])),
  );
  const [sectionsState, setSectionsState] = useState<SectionRow[]>(sections);
  const [pending, setPending] = useState(false);

  const settingKeys = new Set(settings.map((s) => s.key));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const settingsPayload = Object.entries(values)
        .filter(([key]) => settingKeys.has(key))
        .map(([key, value]) => ({ key, value }));
      const [settingsRes, sectionsRes] = await Promise.all([
        updateSettingsAction(settingsPayload),
        updateSectionsAction(
          sectionsState.map((s) => ({ key: s.key, visible: s.visible, order: s.order })),
        ),
      ]);
      if (!settingsRes.ok || !sectionsRes.ok) {
        toast.error("Failed to save settings.");
        return;
      }
      toast.success("Settings saved.");
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
        <h2 className="mb-4 font-display text-lg font-semibold">Site</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {settings.map((setting) => (
            <div key={setting.key} className={setting.key === "siteDescription" ? "sm:col-span-2" : ""}>
              <Label htmlFor={setting.key} className="mb-1.5 block">
                {setting.key}
              </Label>
              {setting.key === "siteDescription" || setting.key === "footerText" ? (
                <Textarea
                  id={setting.key}
                  rows={2}
                  className="font-mono text-sm"
                  value={values[setting.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [setting.key]: e.target.value }))
                  }
                />
              ) : (
                <Input
                  id={setting.key}
                  className="font-mono text-sm"
                  value={values[setting.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [setting.key]: e.target.value }))
                  }
                />
              )}
              {setting.description ? (
                <p className="mt-1.5 text-xs text-muted-foreground">{setting.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Sections</h2>
        <div className="space-y-3">
          {sectionsState.map((section, index) => (
            <div
              key={section.key}
              className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/30 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 font-mono text-xs text-muted-foreground">
                  {section.order}
                </span>
                <div>
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{section.key}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  onClick={() =>
                    setSectionsState((prev) => {
                      const next = [...prev];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      return next.map((s, i) => ({ ...s, order: i }));
                    })
                  }
                >
                  Up
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={index === sectionsState.length - 1}
                  onClick={() =>
                    setSectionsState((prev) => {
                      const next = [...prev];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      return next.map((s, i) => ({ ...s, order: i }));
                    })
                  }
                >
                  Down
                </Button>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`section-${section.key}`} className="text-sm">
                    Visible
                  </Label>
                  <Switch
                    id={`section-${section.key}`}
                    checked={section.visible}
                    onCheckedChange={(v) =>
                      setSectionsState((prev) =>
                        prev.map((s) => (s.key === section.key ? { ...s, visible: v } : s)),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FormActions pending={pending} submitLabel="Save settings" />
    </form>
  );
}
