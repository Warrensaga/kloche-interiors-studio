import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeading } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadMedia, validateImage, IMAGE_ACCEPT, ALLOWED_LABEL, MAX_FILE_BYTES, formatBytes } from "@/lib/media";

export const Route = createFileRoute("/_authenticated/admin/heroes")({
  component: AdminHeroes,
});

type PageDef = { slug: string; label: string; path: string };

/** Every public page that renders a full-bleed hero. */
const PAGES: PageDef[] = [
  { slug: "home", label: "Home", path: "/" },
  { slug: "portfolio", label: "Portfolio", path: "/portfolio" },
  { slug: "services", label: "Services", path: "/services" },
  { slug: "about", label: "About", path: "/about" },
  { slug: "pricing", label: "Pricing", path: "/pricing" },
  { slug: "contact", label: "Contact", path: "/contact" },
];

const heroesKey = ["admin", "heroes"];

type HeroRow = { slug: string; url: string; title: string };

function AdminHeroes() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savingAll, setSavingAll] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: heroesKey,
    queryFn: async (): Promise<HeroRow[]> => {
      const [home, pages] = await Promise.all([
        supabase.from("homepage_sections").select("*").eq("section_key", "hero").maybeSingle(),
        supabase.from("page_sections").select("*").eq("section_key", "hero"),
      ]);
      if (home.error) throw home.error;
      if (pages.error) throw pages.error;
      const homeContent = (home.data?.content ?? {}) as { imageUrl?: string };
      return PAGES.map((p) => {
        if (p.slug === "home")
          return { slug: p.slug, url: homeContent.imageUrl ?? "", title: home.data?.title ?? "" };
        const row = (pages.data ?? []).find((r) => r.page_key === p.slug);
        return { slug: p.slug, url: row?.image_url ?? "", title: row?.title ?? "" };
      });
    },
  });

  const saved = useMemo(() => {
    const map: Record<string, HeroRow> = {};
    (data ?? []).forEach((r) => (map[r.slug] = r));
    return map;
  }, [data]);

  useEffect(() => {
    if (data) setDraft(Object.fromEntries(data.map((r) => [r.slug, r.url])));
  }, [data]);

  async function persist(slug: string, url: string) {
    if (slug === "home") {
      const { data: row, error } = await supabase
        .from("homepage_sections")
        .select("id, content")
        .eq("section_key", "hero")
        .maybeSingle();
      if (error) throw error;
      const content = { ...((row?.content ?? {}) as Record<string, unknown>), imageUrl: url };
      if (row) {
        const { error: err } = await supabase
          .from("homepage_sections")
          .update({ content })
          .eq("id", row.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from("homepage_sections")
          .insert({ section_key: "hero", kind: "hero", content, sort_order: 0 });
        if (err) throw err;
      }
      return;
    }
    const { data: row, error } = await supabase
      .from("page_sections")
      .select("id")
      .eq("page_key", slug)
      .eq("section_key", "hero")
      .maybeSingle();
    if (error) throw error;
    if (row) {
      const { error: err } = await supabase
        .from("page_sections")
        .update({ image_url: url })
        .eq("id", row.id);
      if (err) throw err;
    } else {
      const { error: err } = await supabase
        .from("page_sections")
        .insert({ page_key: slug, section_key: "hero", kind: "hero", image_url: url, sort_order: 0 });
      if (err) throw err;
    }
  }

  async function saveOne(slug: string) {
    try {
      await persist(slug, draft[slug] ?? "");
      await queryClient.invalidateQueries({ queryKey: heroesKey });
      toast.success(`${PAGES.find((p) => p.slug === slug)?.label} hero updated`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save that hero image.");
    }
  }

  async function saveAll() {
    setSavingAll(true);
    try {
      const changed = PAGES.filter((p) => (draft[p.slug] ?? "") !== (saved[p.slug]?.url ?? ""));
      if (!changed.length) {
        toast.info("Nothing to save — every hero is already up to date.");
        return;
      }
      for (const p of changed) await persist(p.slug, draft[p.slug] ?? "");
      await queryClient.invalidateQueries({ queryKey: heroesKey });
      toast.success(`Saved ${changed.length} hero image${changed.length > 1 ? "s" : ""}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save all heroes.");
    } finally {
      setSavingAll(false);
    }
  }

  return (
    <div className="space-y-8">
      <AdminHeading
        eyebrow="Appearance"
        title="Hero images"
        description="Set the large background photo at the top of every page. Drag a photo in, upload one, or pick from your media library."
        actions={
          <Button onClick={saveAll} disabled={savingAll}>
            {savingAll && <Loader2 className="mr-2 animate-spin" size={15} />}
            Save all settings
          </Button>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading heroes…</p>}

      <div className="grid gap-5 lg:grid-cols-2">
        {PAGES.map((p) => (
          <HeroCard
            key={p.slug}
            page={p}
            value={draft[p.slug] ?? ""}
            savedValue={saved[p.slug]?.url ?? ""}
            title={saved[p.slug]?.title ?? ""}
            onChange={(v) => setDraft((d) => ({ ...d, [p.slug]: v }))}
            onSave={() => saveOne(p.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function HeroCard({
  page,
  value,
  savedValue,
  title,
  onChange,
  onSave,
}: {
  page: PageDef;
  value: string;
  savedValue: string;
  title: string;
  onChange: (v: string) => void;
  onSave: () => void | Promise<void>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const dirty = value !== savedValue;

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const asset = await uploadMedia(file, "heroes", setProgress);
      onChange(asset.url);
      toast.success("Image uploaded — remember to save.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl">{page.label}</h2>
          <p className="truncate text-xs text-muted-foreground">
            {title || page.path}
          </p>
        </div>
        <Button size="sm" variant={dirty ? "default" : "outline"} disabled={!dirty || saving} onClick={async () => {
          setSaving(true);
          await onSave();
          setSaving(false);
        }}>
          {saving && <Loader2 className="mr-2 animate-spin" size={14} />}
          Save changes
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-secondary/40">
        {value ? (
          <img src={value} alt={`${page.label} hero preview`} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 w-full items-center justify-center text-xs text-muted-foreground">
            No hero image set — the built-in photo is used.
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-charcoal/30" />
        <p className="pointer-events-none absolute bottom-3 left-4 max-w-[85%] truncate font-display text-lg text-cream">
          {title || page.label}
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border border-dashed p-4 text-center transition ${
          dragOver ? "border-accent bg-accent/5" : "border-border"
        }`}
      >
        <UploadCloud className="mx-auto text-muted-foreground" size={18} />
        <p className="mt-2 text-xs text-muted-foreground">
          Drag a photo here, or{" "}
          <label className="cursor-pointer text-accent underline underline-offset-2">
            browse
            <input
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </p>
        <p className="mt-1 text-[0.65rem] text-muted-foreground">
          {ALLOWED_LABEL} · max {formatBytes(MAX_FILE_BYTES)}
        </p>
        {busy && (
          <div className="mt-3 space-y-1">
            <Progress value={progress} />
            <p className="text-[0.65rem] text-muted-foreground">Uploading — {progress}%</p>
          </div>
        )}
      </div>

      <MediaPicker value={value} onChange={onChange} label="Image URL or library" folder="heroes" />
    </section>
  );
}
