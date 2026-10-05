import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminProjects,
});

const projectsQuery = {
  queryKey: ["admin", "projects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, slug, name, location, project_type, cover_url, published, sort_order")
      .order("sort_order");
    if (error) throw error;
    return data;
  },
};

function AdminProjects() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading, error } = useQuery(projectsQuery);

  async function togglePublished(id: string, published: boolean) {
    await supabase.from("projects").update({ published: !published }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from("projects").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {projects ? `${projects.length} project${projects.length === 1 ? "" : "s"}` : "…"} ·
            published projects appear on the public portfolio
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/projects/$id" params={{ id: "new" }}>
            <Plus size={16} /> New project
          </Link>
        </Button>
      </div>

      {isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading projects…</p>}
      {error && (
        <p className="mt-10 text-sm text-destructive">Couldn't load projects. Try refreshing.</p>
      )}

      <div className="mt-8 grid gap-4">
        {projects?.map((p) => (
          <div
            key={p.id}
            className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4"
          >
            <img
              src={p.cover_url}
              alt=""
              className="h-14 w-20 shrink-0 rounded-xl bg-muted object-cover sm:h-16 sm:w-24"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-base sm:text-lg">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {p.location} · {p.project_type} · /{p.slug}
              </p>
            </div>
            <span
              className={`col-start-1 row-start-2 w-fit shrink-0 rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] sm:col-start-3 sm:row-start-1 ${
                p.published ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
              }`}
            >
              {p.published ? "Published" : "Draft"}
            </span>
            <div className="col-start-2 row-start-2 ml-auto flex shrink-0 gap-2 sm:col-start-3 sm:row-start-2">
              <Button variant="outline" size="sm" aria-label={p.published ? `Unpublish ${p.name}` : `Publish ${p.name}`} onClick={() => togglePublished(p.id, p.published)}>
                {p.published ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/projects/$id" params={{ id: p.id }} aria-label={`Edit ${p.name}`}>
                  <Pencil size={15} />
                </Link>
              </Button>
              <Button variant="outline" size="sm" aria-label={`Delete ${p.name}`} onClick={() => remove(p.id, p.name)}>
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
