import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminHeading } from "@/components/admin/fields";
import { deleteMedia, uploadMedia } from "@/lib/media";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] });

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) await uploadMedia(file);
      toast.success("Uploaded");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const list = (data ?? []).filter((a) =>
    a.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Media library"
        description="Upload once, reuse anywhere. Images are served with long-lived caching."
      />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Input type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} className="max-w-sm" />
        {busy && <Loader2 size={16} className="animate-spin" />}
        <Input
          placeholder="Search files…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((a) => (
          <figure key={a.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={a.url} alt={a.alt || a.name} loading="lazy" className="h-36 w-full object-cover" />
            <figcaption className="space-y-2 p-3">
              <Input
                value={a.name}
                onChange={async (e) => {
                  await supabase.from("media_assets").update({ name: e.target.value }).eq("id", a.id);
                  refresh();
                }}
                className="h-8 text-xs"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-accent"
                  onClick={() => {
                    navigator.clipboard.writeText(a.url);
                    toast.success("URL copied");
                  }}
                >
                  Copy URL
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete"
                  onClick={async () => {
                    if (!window.confirm(`Delete ${a.name}?`)) return;
                    await deleteMedia(a.id, a.path);
                    refresh();
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {!list.length && <p className="mt-10 text-sm text-muted-foreground">No images yet.</p>}
    </>
  );
}
