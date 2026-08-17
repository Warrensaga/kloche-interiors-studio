import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { deleteMedia, formatBytes, MAX_FILE_BYTES, uploadMedia, validateImage } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const mediaQueryKey = ["admin", "media"];

/** Reusable image field: paste a URL, upload new files, or pick from the library. */
export function MediaPicker({
  value,
  onChange,
  label = "Image",
  folder = "uploads",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: assets } = useQuery({
    queryKey: mediaQueryKey,
    queryFn: async () => {
      const { data, error: err } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      return data;
    },
    enabled: open,
  });

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    setError(null);
    setBusy(true);
    let lastUrl = "";
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const invalid = validateImage(file);
        if (invalid) throw new Error(invalid);
        setStatus(`Uploading ${file.name} (${i + 1}/${files.length})`);
        setProgress(0);
        const asset = await uploadMedia(file, folder, setProgress);
        lastUrl = asset.url;
      }
      if (lastUrl) onChange(lastUrl);
      queryClient.invalidateQueries({ queryKey: mediaQueryKey });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setStatus(null);
      setProgress(0);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</label>
      <div className="flex min-w-0 gap-2">
        <Input className="min-w-0" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon" aria-label="Choose image">
              <ImagePlus size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80svh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Media library</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                  disabled={busy}
                />
                {busy && <Loader2 className="animate-spin" size={16} />}
              </div>
              <p className="text-[0.65rem] text-muted-foreground">
                JPG, PNG or WEBP · max {formatBytes(MAX_FILE_BYTES)} per file
              </p>
              {busy && (
                <div className="space-y-1">
                  <Progress value={progress} />
                  <p className="text-[0.65rem] text-muted-foreground">
                    {status} — {progress}%
                  </p>
                </div>
              )}
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(assets ?? []).map((a) => (
                <div
                  key={a.id}
                  className="group relative overflow-hidden rounded-xl border border-border transition hover:border-accent"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(a.url);
                      setOpen(false);
                    }}
                    className="block w-full text-left"
                  >
                    <img src={a.url} alt={a.alt || a.name} className="h-24 w-full object-cover" />
                    <span className="block truncate p-2 text-[0.65rem] text-muted-foreground">
                      {a.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${a.name}`}
                    className="absolute right-1 top-1 rounded-full bg-background/90 p-1.5 text-muted-foreground opacity-0 transition hover:text-destructive focus:opacity-100 group-hover:opacity-100"
                    onClick={async () => {
                      if (!window.confirm(`Delete ${a.name}? This cannot be undone.`)) return;
                      try {
                        await deleteMedia(a.id, a.path);
                        if (value === a.url) onChange("");
                        queryClient.invalidateQueries({ queryKey: mediaQueryKey });
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Delete failed.");
                      }
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {value && (
        <div className="relative w-40">
          <img
            src={value}
            alt="Selected image preview"
            className="h-24 w-40 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-1 text-muted-foreground hover:text-destructive"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
