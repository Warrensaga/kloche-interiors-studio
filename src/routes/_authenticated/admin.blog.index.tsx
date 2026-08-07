import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AdminHeading } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/blog/")({
  component: AdminBlogList,
});

function AdminBlogList() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, category, published, published_at, cover_url")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Journal"
        description="Write and publish articles. Published posts appear at /journal and in the sitemap."
        actions={
          <Button asChild>
            <Link to="/admin/blog/$id" params={{ id: "new" }}>
              <Plus size={16} /> New post
            </Link>
          </Button>
        }
      />

      <div className="mt-8 space-y-3">
        {(data ?? []).map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            {p.cover_url ? (
              <img src={p.cover_url} alt="" className="h-14 w-20 rounded-lg object-cover" />
            ) : (
              <div className="h-14 w-20 rounded-lg bg-secondary" />
            )}
            <div className="min-w-40 flex-1">
              <p className="font-display text-lg">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                /journal/{p.slug} {p.category && `· ${p.category}`}
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <Switch
                checked={p.published}
                onCheckedChange={async (v) => {
                  await supabase
                    .from("blog_posts")
                    .update({
                      published: v,
                      published_at: v ? (p.published_at ?? new Date().toISOString()) : null,
                    })
                    .eq("id", p.id);
                  refresh();
                }}
              />
              Published
            </label>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/blog/$id" params={{ id: p.id }}>
                Edit
              </Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Delete"
              onClick={async () => {
                if (!window.confirm(`Delete "${p.title}"?`)) return;
                await supabase.from("blog_posts").delete().eq("id", p.id);
                refresh();
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
        {!data?.length && <p className="text-sm text-muted-foreground">No posts yet.</p>}
      </div>
    </>
  );
}
