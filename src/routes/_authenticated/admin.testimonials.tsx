import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminHeading } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: AdminTestimonials,
});

function AdminTestimonials() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  }

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Testimonials"
        description="Client words shown on the homepage."
        actions={
          <Button
            onClick={async () => {
              await supabase
                .from("testimonials")
                .insert({ quote: "", name: "Client name", sort_order: data?.length ?? 0 });
              refresh();
            }}
          >
            <Plus size={16} /> New testimonial
          </Button>
        }
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {(data ?? []).map((t) => (
          <article key={t.id} className="space-y-3 rounded-3xl border border-border bg-card p-6">
            <Textarea
              rows={4}
              value={t.quote}
              placeholder="Quote"
              onChange={(e) => update(t.id, { quote: e.target.value })}
            />
            <Input value={t.name} placeholder="Name" onChange={(e) => update(t.id, { name: e.target.value })} />
            <Input
              value={t.detail}
              placeholder="Detail (e.g. Karen, Nairobi)"
              onChange={(e) => update(t.id, { detail: e.target.value })}
            />
            <Input
              value={t.project_name}
              placeholder="Project"
              onChange={(e) => update(t.id, { project_name: e.target.value })}
            />
            <MediaPicker label="Photo" value={t.photo_url} onChange={(v) => update(t.id, { photo_url: v })} />
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Rating
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={t.rating}
                  className="h-8 w-16"
                  onChange={(e) => update(t.id, { rating: Number(e.target.value) })}
                />
              </label>
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <Switch checked={t.visible} onCheckedChange={(v) => update(t.id, { visible: v })} />
                Visible
              </label>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete"
                onClick={async () => {
                  if (!window.confirm("Delete this testimonial?")) return;
                  await supabase.from("testimonials").delete().eq("id", t.id);
                  refresh();
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
