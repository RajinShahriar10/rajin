"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSkillAction,
  createSkillCategoryAction,
  deleteSkillAction,
  deleteSkillCategoryAction,
  updateSkillAction,
  updateSkillCategoryAction,
} from "@/lib/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Skill = { id: string; name: string; level: number | null; order: number; visible: boolean };
type Category = {
  id: string;
  name: string;
  description: string | null;
  order: number;
  visible: boolean;
  skills: Skill[];
};

export function SkillsManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [pendingCategory, setPendingCategory] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setPendingCategory(true);
    try {
      const res = await createSkillCategoryAction({
        name: categoryName,
        description: categoryDescription || undefined,
        order: categories.length,
        visible: true,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Category added.");
      setCategoryName("");
      setCategoryDescription("");
      setAdding(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPendingCategory(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        {adding ? (
          <form
            onSubmit={addCategory}
            className="rounded-lg border border-border bg-card p-5 space-y-4"
          >
            <h2 className="font-display font-semibold">New skill category</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="cat-name" className="mb-1.5 block">
                  Name
                </Label>
                <Input
                  id="cat-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Frontend"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="cat-desc" className="mb-1.5 block">
                  Description
                </Label>
                <Input
                  id="cat-desc"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Optional one-liner"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pendingCategory}>
                <Plus className="h-4 w-4" />
                Add category
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="outline" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            New category
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
          No skill categories yet. Create your first one to get started.
        </div>
      ) : (
        categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))
      )}
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [editing, setEditing] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [pendingSkill, setPendingSkill] = useState(false);

  async function saveCategory() {
    setSavingCategory(true);
    try {
      const res = await updateSkillCategoryAction(category.id, {
        name,
        description: description || undefined,
        order: category.order,
        visible: category.visible,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Category saved.");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function addSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setPendingSkill(true);
    try {
      const res = await createSkillAction(category.id, {
        name: newSkillName,
        level: newSkillLevel || "",
        order: category.skills.length,
        visible: true,
        highlight: false,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Skill added.");
      setNewSkillName("");
      setNewSkillLevel("");
      setAddingSkill(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPendingSkill(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          {editing ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-64"
                  autoFocus
                />
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-80"
                />
                <Button size="sm" onClick={saveCategory} disabled={savingCategory}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <CardTitle className="text-base">{category.name}</CardTitle>
              {category.description ? (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              ) : null}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
          <DeleteButton
            onDelete={async () => {
              const res = await deleteSkillCategoryAction(category.id);
              return { ok: res.ok };
            }}
            confirmTitle="Delete this category?"
            confirmDescription={`All skills in "${category.name}" will be removed too.`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {category.skills.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">No skills in this category.</p>
          ) : (
            category.skills.map((skill) => (
              <SkillRow key={skill.id} skill={skill} />
            ))
          )}
        </div>

        {addingSkill ? (
          <form onSubmit={addSkill} className="mt-4 flex flex-wrap items-end gap-2">
            <div>
              <Label htmlFor={`skill-name-${category.id}`} className="mb-1 block text-xs">
                Skill
              </Label>
              <Input
                id={`skill-name-${category.id}`}
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="React"
                className="w-48"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor={`skill-level-${category.id}`} className="mb-1 block text-xs">
                Level (0–100)
              </Label>
              <Input
                id={`skill-level-${category.id}`}
                type="number"
                min={0}
                max={100}
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                placeholder="85"
                className="w-32"
              />
            </div>
            <Button size="sm" type="submit" disabled={pendingSkill}>
              Add
            </Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setAddingSkill(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setAddingSkill(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add skill
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function SkillRow({ skill }: { skill: Skill }) {
  const router = useRouter();
  const [name, setName] = useState(skill.name);
  const [level, setLevel] = useState(skill.level ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await updateSkillAction(skill.id, {
        name,
        level: level || "",
        order: skill.order,
        visible: skill.visible,
        highlight: false,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Skill saved.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 flex-1"
        aria-label="Skill name"
      />
      <div className="flex w-36 items-center gap-2">
        <Input
          type="number"
          min={0}
          max={100}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="h-8 w-16"
          aria-label="Skill level"
        />
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(Math.max(Number(level) || 0, 0), 100)}%` }}
          />
        </div>
      </div>
      <Button size="sm" variant="ghost" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
      <DeleteButton
        onDelete={async () => {
          const res = await deleteSkillAction(skill.id);
          return { ok: res.ok };
        }}
        confirmTitle="Delete this skill?"
        confirmDescription={`"${name}" will be removed from this category.`}
      />
    </div>
  );
}
