import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminHeading } from "@/components/admin/fields";
import { Progress } from "@/components/ui/progress";
import {
  deleteMedia,
  formatBytes,
  MAX_FILE_BYTES,
  uploadMedia,
  validateImage,
} from "@/lib/media";


export const Route = createFileRoute("/_authenticated/admin/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
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
    const list = Array.from(files ?? []);
    if (!list.length) return;
    setBusy(true);
    try {
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        const invalid = validateImage(file);
        if (invalid) throw new Error(invalid);
        setStatus(`${file.name} (${i + 1}/${list.length})`);
        setProgress(0);
        await uploadMedia(file, "uploads", setProgress);
      }
      toast.success(list.length > 1 ? `${list.length} images uploaded` : "Uploaded");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      setStatus(null);
      setProgress(0);
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
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
          className="max-w-sm"
          disabled={busy}
        />
        {busy && <Loader2 size={16} className="animate-spin" />}
        <Input
          placeholder="Search files…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <p className="mt-2 text-[0.7rem] text-muted-foreground">
        JPG, PNG or WEBP · max {formatBytes(MAX_FILE_BYTES)} per file
      </p>
      {busy && (
        <div className="mt-3 max-w-sm space-y-1">
          <Progress value={progress} />
          <p className="text-[0.7rem] text-muted-foreground">
            Uploading {status} — {progress}%
          </p>
        </div>
      )}


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
