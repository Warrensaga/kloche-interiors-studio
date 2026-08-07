import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const mediaQueryKey = ["admin", "media"];

/** Reusable image field: paste a URL, upload a new file, or pick from the library. */
export function MediaPicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const { data: assets } = useQuery({
    queryKey: mediaQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const asset = await uploadMedia(file);
      onChange(asset.url);
      queryClient.invalidateQueries({ queryKey: mediaQueryKey });
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</label>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
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
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0])}
                disabled={busy}
              />
              {busy && <Loader2 className="animate-spin" size={16} />}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(assets ?? []).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    onChange(a.url);
                    setOpen(false);
                  }}
                  className="overflow-hidden rounded-xl border border-border transition hover:border-accent"
                >
                  <img src={a.url} alt={a.alt || a.name} className="h-24 w-full object-cover" />
                  <span className="block truncate p-2 text-[0.65rem] text-muted-foreground">
                    {a.name}
                  </span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {value && (
        <img
          src={value}
          alt=""
          className="h-24 w-40 rounded-lg border border-border object-cover"
        />
      )}
    </div>
  );
}
