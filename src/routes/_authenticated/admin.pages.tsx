import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeading } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PAGE_KEYS, slugify } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: AdminPages,
});

function AdminPages() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<string>(PAGE_KEYS[0].key);

  const { data } = useQuery({
    queryKey: ["admin", "page-sections", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_key", page)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "page-sections", page] });

  async function update(id: string, patch: TablesUpdate<"page_sections">) {
    const { error } = await supabase.from("page_sections").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  }

  async function add() {
    const { error } = await supabase.from("page_sections").insert({
      page_key: page,
      section_key: `section-${slugify(String(Date.now()))}`,
      title: "New section",
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
    await supabase.from("page_sections").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("page_sections").update({ sort_order: a.sort_order }).eq("id", b.id);
    refresh();
  }

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Pages"
        description="Edit the headings and copy on each public page. Empty fields keep the built-in wording."
        actions={
          <Button onClick={add}>
            <Plus size={16} /> Add section
          </Button>
        }
      />

      <Tabs value={page} onValueChange={setPage} className="mt-8">
        <TabsList className="flex-wrap">
          {PAGE_KEYS.map((p) => (
            <TabsTrigger key={p.key} value={p.key}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6 space-y-5">
        {(data ?? []).map((s, i) => (
          <article key={s.id} className="grid gap-4 rounded-3xl border border-border bg-card p-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Input
                value={s.section_key}
                onChange={(e) => update(s.id, { section_key: e.target.value })}
                className="font-mono text-xs"
              />
              <Input
                value={s.eyebrow}
                placeholder="Eyebrow"
                onChange={(e) => update(s.id, { eyebrow: e.target.value })}
              />
              <Input value={s.title} placeholder="Heading" onChange={(e) => update(s.id, { title: e.target.value })} />
              <Textarea
                rows={6}
                value={s.body}
                placeholder="Body copy"
                onChange={(e) => update(s.id, { body: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <MediaPicker value={s.image_url} onChange={(v) => update(s.id, { image_url: v })} />
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
                    if (!window.confirm("Delete this section?")) return;
                    await supabase.from("page_sections").delete().eq("id", s.id);
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
            This page has no custom sections yet — add one to override its wording.
          </p>
        )}
      </div>
    </>
  );
}
