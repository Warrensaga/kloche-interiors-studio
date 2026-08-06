import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Eye, EyeOff, Plus, Trash2, Save, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HomepageSection, SectionContent } from "@/lib/homepage.functions";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageEditor,
});

const KIND_LABEL: Record<string, string> = {
  hero: "Hero",
  richtext: "Text block",
  projects: "Featured projects",
  services: "Services",
  pillars: "Pillars",
  stats: "Stats",
  philosophy: "Philosophy",
  testimonials: "Testimonials",
  cta: "Call to action",
};

function HomepageEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "homepage"],
    queryFn: async (): Promise<HomepageSection[]> => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []).map((r) => ({
        ...r,
        kind: r.kind as HomepageSection["kind"],
        content: (r.content ?? {}) as SectionContent,
      }));
    },
  });

  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data) setSections(data);
  }, [data]);

  function update(id: string, patch: Partial<HomepageSection>) {
    setSections((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    setDirty(true);
  }

  function updateContent(id: string, patch: Partial<SectionContent>) {
    setSections((s) =>
      s.map((x) => (x.id === id ? { ...x, content: { ...x.content, ...patch } } : x)),
    );
    setDirty(true);
  }

  function reorder(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    setSections((list) => {
      const next = [...list];
      const from = next.findIndex((s) => s.id === sourceId);
      const to = next.findIndex((s) => s.id === targetId);
      if (from < 0 || to < 0) return list;
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next.map((s, i) => ({ ...s, sort_order: i }));
    });
    setDirty(true);
  }

  function move(id: string, dir: -1 | 1) {
    const idx = sections.findIndex((s) => s.id === id);
    const target = sections[idx + dir];
    if (target) reorder(id, target.id);
  }

  async function saveAll() {
    setSaving(true);
    const results = await Promise.all(
      sections.map((s, i) =>
        supabase
          .from("homepage_sections")
          .update({
            eyebrow: s.eyebrow,
            title: s.title,
            body: s.body,
            content: s.content as never,
            visible: s.visible,
            sort_order: i,
          })
          .eq("id", s.id),
      ),
    );
    setSaving(false);
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      toast.error("Couldn't save changes", { description: failed.error.message });
      return;
    }
    setDirty(false);
    toast.success("Homepage updated");
    queryClient.invalidateQueries({ queryKey: ["admin", "homepage"] });
  }

  async function removeSection(s: HomepageSection) {
    if (!window.confirm(`Remove the "${s.title || KIND_LABEL[s.kind]}" section?`)) return;
    const { error } = await supabase.from("homepage_sections").delete().eq("id", s.id);
    if (error) return toast.error("Couldn't remove section");
    setSections((list) => list.filter((x) => x.id !== s.id));
    toast.success("Section removed");
  }

  async function addSection(kind: string) {
    const { data: row, error } = await supabase
      .from("homepage_sections")
      .insert({
        section_key: `${kind}-${Date.now()}`,
        kind,
        title: KIND_LABEL[kind] ?? "New section",
        sort_order: sections.length,
      })
      .select("*")
      .single();
    if (error || !row) return toast.error("Couldn't add section");
    setSections((list) => [
      ...list,
      { ...row, kind: row.kind as HomepageSection["kind"], content: {} },
    ]);
    setOpenId(row.id);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">Homepage</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Drag sections to reorder, hide what you don't need, and edit the copy in place.
          </p>
        </div>
        <Button onClick={saveAll} disabled={saving || !dirty}>
          <Save size={16} /> {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </Button>
      </div>

      {isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading sections…</p>}
      {error && <p className="mt-10 text-sm text-destructive">Couldn't load the homepage.</p>}

      <div className="mt-8 grid gap-3">
        {sections.map((s, i) => {
          const open = openId === s.id;
          return (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDragId(s.id)}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOverId(s.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) reorder(dragId, s.id);
                setOverId(null);
              }}
              className={`rounded-2xl border bg-card transition-colors ${
                overId === s.id && dragId !== s.id ? "border-accent" : "border-border"
              } ${dragId === s.id ? "opacity-60" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-3 p-4">
                <span className="cursor-grab text-muted-foreground active:cursor-grabbing">
                  <GripVertical size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg">
                    {s.title || KIND_LABEL[s.kind] || s.section_key}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {KIND_LABEL[s.kind] ?? s.kind} · position {i + 1}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Move up"
                    disabled={i === 0}
                    onClick={() => move(s.id, -1)}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Move down"
                    disabled={i === sections.length - 1}
                    onClick={() => move(s.id, 1)}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={s.visible ? "Hide section" : "Show section"}
                    onClick={() => update(s.id, { visible: !s.visible })}
                  >
                    {s.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Edit section"
                    onClick={() => setOpenId(open ? null : s.id)}
                  >
                    <ChevronDown
                      size={15}
                      className={`transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Remove section"
                    onClick={() => removeSection(s)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>

              {open && (
                <div className="grid gap-4 border-t border-border p-5">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label>Eyebrow</Label>
                      <Input
                        value={s.eyebrow}
                        onChange={(e) => update(s.id, { eyebrow: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Title</Label>
                      <Input
                        value={s.title}
                        onChange={(e) => update(s.id, { title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <Label>Body copy</Label>
                    <Textarea
                      rows={3}
                      value={s.body}
                      onChange={(e) => update(s.id, { body: e.target.value })}
                    />
                  </div>

                  {s.kind === "richtext" && (
                    <div className="grid gap-1.5">
                      <Label>Paragraphs (one per line)</Label>
                      <Textarea
                        rows={6}
                        value={(s.content.paragraphs ?? []).join("\n")}
                        onChange={(e) =>
                          updateContent(s.id, {
                            paragraphs: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                      />
                    </div>
                  )}

                  {s.kind === "hero" && (
                    <div className="grid gap-1.5 sm:max-w-sm">
                      <Label>Primary button label</Label>
                      <Input
                        value={s.content.ctaLabel ?? ""}
                        onChange={(e) => updateContent(s.id, { ctaLabel: e.target.value })}
                      />
                    </div>
                  )}

                  {s.kind === "projects" && (
                    <div className="grid gap-1.5 sm:max-w-[10rem]">
                      <Label>Projects shown</Label>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        value={s.content.limit ?? 4}
                        onChange={(e) =>
                          updateContent(s.id, { limit: Number(e.target.value) || 4 })
                        }
                      />
                    </div>
                  )}

                  {s.kind === "stats" && (
                    <ItemsEditor
                      fields={["value", "label"]}
                      items={(s.content.items ?? []) as Record<string, string>[]}
                      onChange={(items) => updateContent(s.id, { items: items as never })}
                    />
                  )}

                  {s.kind === "testimonials" && (
                    <ItemsEditor
                      fields={["quote", "name", "detail"]}
                      items={(s.content.items ?? []) as Record<string, string>[]}
                      onChange={(items) => updateContent(s.id, { items: items as never })}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border p-4">
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Add section
        </span>
        {["richtext", "stats", "testimonials", "cta"].map((k) => (
          <Button key={k} variant="outline" size="sm" onClick={() => addSection(k)}>
            <Plus size={14} /> {KIND_LABEL[k]}
          </Button>
        ))}
      </div>
    </>
  );
}

function ItemsEditor({
  fields,
  items,
  onChange,
}: {
  fields: string[];
  items: Record<string, string>[];
  onChange: (items: Record<string, string>[]) => void;
}) {
  function set(i: number, key: string, value: string) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  }

  return (
    <div className="grid gap-3">
      <Label>Items</Label>
      {items.map((item, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f} className="grid gap-1.5">
              <Label className="text-xs capitalize text-muted-foreground">{f}</Label>
              <Input value={item[f] ?? ""} onChange={(e) => set(i, f, e.target.value)} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              <Trash2 size={14} /> Remove item
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() =>
          onChange([...items, Object.fromEntries(fields.map((f) => [f, ""])) as Record<string, string>])
        }
      >
        <Plus size={14} /> Add item
      </Button>
    </div>
  );
}
