import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminHeading } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { slugify } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: AdminServices,
});

function AdminServices() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] });

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("services").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  }

  async function add() {
    const title = "New service";
    const { error } = await supabase.from("services").insert({
      title,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      sort_order: data?.length ?? 0,
    });
    if (error) toast.error(error.message);
    else refresh();
  }

  async function move(index: number, dir: -1 | 1) {
    const list = data ?? [];
    const a = list[index];
    const b = list[index + dir];
    if (!a || !b) return;
    await supabase.from("services").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("services").update({ sort_order: a.sort_order }).eq("id", b.id);
    refresh();
  }

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Services"
        description="What the studio offers, shown on the homepage and services page."
        actions={
          <Button onClick={add}>
            <Plus size={16} /> New service
          </Button>
        }
      />

      <div className="mt-8 space-y-5">
        {(data ?? []).map((s, i) => (
          <article key={s.id} className="grid gap-4 rounded-3xl border border-border bg-card p-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Input
                value={s.number_label}
                placeholder="SERVICE 01"
                onChange={(e) => update(s.id, { number_label: e.target.value })}
              />
              <Input
                value={s.title}
                placeholder="Title"
                onChange={(e) => update(s.id, { title: e.target.value })}
              />
              <Textarea
                rows={2}
                value={s.summary}
                placeholder="Short summary"
                onChange={(e) => update(s.id, { summary: e.target.value })}
              />
              <Textarea
                rows={5}
                value={s.description}
                placeholder="Full description"
                onChange={(e) => update(s.id, { description: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <MediaPicker value={s.image_url} onChange={(v) => update(s.id, { image_url: v })} />
              <Textarea
                rows={4}
                value={s.bullets.join("\n")}
                placeholder="One bullet point per line"
                onChange={(e) =>
                  update(s.id, { bullets: e.target.value.split("\n").filter((l) => l.trim()) })
                }
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <Switch checked={s.visible} onCheckedChange={(v) => update(s.id, { visible: v })} />
                  Visible
                </label>
                <Button size="icon" variant="ghost" onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp size={14} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => move(i, 1)} aria-label="Move down">
                  <ArrowDown size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete"
                  onClick={async () => {
                    if (!window.confirm(`Delete "${s.title}"?`)) return;
                    await supabase.from("services").delete().eq("id", s.id);
                    refresh();
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </article>
        ))}
        {!data?.length && (
          <p className="text-sm text-muted-foreground">
            No services added yet — the site is showing its built-in service list.
          </p>
        )}
      </div>
    </>
  );
}
