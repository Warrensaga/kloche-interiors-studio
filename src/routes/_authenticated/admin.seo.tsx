import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminHeading } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";

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

function AdminSeo() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "seo"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_meta").select("*").order("path");
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "seo"] });

  async function update(id: string, patch: TablesUpdate<"seo_meta">) {
    const { error } = await supabase.from("seo_meta").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  }

  const existing = new Set((data ?? []).map((d) => d.page_key));
  const missing = DEFAULT_PAGES.filter((p) => !existing.has(p.page_key));

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="SEO"
        description="Per-page titles, descriptions, social preview images and canonical URLs. Blank fields keep the built-in defaults."
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

      <div className="mt-8 space-y-5">
        {(data ?? []).map((s) => (
          <article key={s.id} className="grid gap-4 rounded-3xl border border-border bg-card p-6 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-accent">{s.path}</p>
              <Input
                value={s.title}
                placeholder="Meta title (under 60 characters)"
                onChange={(e) => update(s.id, { title: e.target.value })}
              />
              <Textarea
                rows={3}
                value={s.description}
                placeholder="Meta description (under 160 characters)"
                onChange={(e) => update(s.id, { description: e.target.value })}
              />
              <Input
                value={s.canonical}
                placeholder="Canonical URL (optional)"
                onChange={(e) => update(s.id, { canonical: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <MediaPicker
                label="Social preview image"
                value={s.og_image}
                onChange={(v) => update(s.id, { og_image: v })}
              />
              <Textarea
                rows={4}
                value={s.schema_json}
                placeholder="Extra schema markup (JSON-LD, optional)"
                onChange={(e) => update(s.id, { schema_json: e.target.value })}
                className="font-mono text-xs"
              />
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <Switch checked={s.noindex} onCheckedChange={(v) => update(s.id, { noindex: v })} />
                Hide from search engines
              </label>
            </div>
          </article>
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
