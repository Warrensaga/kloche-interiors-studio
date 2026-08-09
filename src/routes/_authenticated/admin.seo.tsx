import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminHeading } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { SeoPreview, type SeoDraft } from "@/components/admin/SeoPreview";

export const Route = createFileRoute("/_authenticated/admin/seo")({
  component: AdminSeo,
});

const DEFAULT_PAGES = [
  { page_key: "home", path: "/" },
  { page_key: "portfolio", path: "/portfolio" },
  { page_key: "services", path: "/services" },
  { page_key: "about", path: "/about" },
  { page_key: "pricing", path: "/pricing" },
  { page_key: "contact", path: "/contact" },
  { page_key: "journal", path: "/journal" },
];

type Row = SeoDraft & { id: string };

function AdminSeo() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "seo"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_meta").select("*").order("path");
      if (error) throw error;
      return data as Row[];
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "seo"] });

  const existing = new Set((data ?? []).map((d) => d.page_key));
  const missing = DEFAULT_PAGES.filter((p) => !existing.has(p.page_key));

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="SEO & social previews"
        description="Check exactly how each page appears on Google and when shared on WhatsApp, Facebook or X. Saved changes go live on the website immediately. Blank fields keep the built-in defaults."
        actions={
          missing.length ? (
            <Button
              onClick={async () => {
                await supabase.from("seo_meta").insert(missing);
                refresh();
              }}
            >
              <Plus size={16} /> Add missing pages
            </Button>
          ) : null
        }
      />

      <div className="mt-8 space-y-6">
        {(data ?? []).map((s) => (
          <SeoCard key={s.id} row={s} onSaved={refresh} />
        ))}
        {!data?.length && (
          <p className="text-sm text-muted-foreground">
            No SEO overrides yet — use “Add missing pages” to start editing.
          </p>
        )}
      </div>
    </>
  );
}

function SeoCard({ row, onSaved }: { row: Row; onSaved: () => void }) {
  const [draft, setDraft] = useState<SeoDraft>(row);
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(row), [row]);

  const dirty = (Object.keys(draft) as (keyof SeoDraft)[]).some((k) => draft[k] !== row[k]);
  const set = <K extends keyof SeoDraft>(k: K, v: SeoDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("seo_meta")
      .update({
        title: draft.title,
        description: draft.description,
        og_image: draft.og_image,
        canonical: draft.canonical,
        schema_json: draft.schema_json,
        noindex: draft.noindex,
      })
      .eq("id", row.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Saved — ${draft.path} is updated on the live site.`);
      onSaved();
    }
  }

  return (
    <article className="grid gap-6 rounded-3xl border border-border bg-card p-6 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-accent">{draft.path}</p>
          <Button size="sm" onClick={save} disabled={!dirty || saving}>
            <Save size={15} /> {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </Button>
        </div>
        <Input
          value={draft.title}
          placeholder="Meta title (under 60 characters)"
          onChange={(e) => set("title", e.target.value)}
        />
        <Textarea
          rows={3}
          value={draft.description}
          placeholder="Meta description (under 160 characters)"
          onChange={(e) => set("description", e.target.value)}
        />
        <Input
          value={draft.canonical}
          placeholder="Canonical URL (optional)"
          onChange={(e) => set("canonical", e.target.value)}
        />
        <MediaPicker
          label="Social preview image"
          value={draft.og_image}
          onChange={(v) => set("og_image", v)}
        />
        <Textarea
          rows={4}
          value={draft.schema_json}
          placeholder="Extra schema markup (JSON-LD, optional)"
          onChange={(e) => set("schema_json", e.target.value)}
          className="font-mono text-xs"
        />
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Switch checked={draft.noindex} onCheckedChange={(v) => set("noindex", v)} />
          Hide from search engines
        </label>
      </div>

      <SeoPreview draft={draft} />
    </article>
  );
}
