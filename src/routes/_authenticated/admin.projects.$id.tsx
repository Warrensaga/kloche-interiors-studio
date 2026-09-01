import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2, Plus, Upload, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { formatBytes, MAX_FILE_BYTES, uploadMedia, validateImage, IMAGE_ACCEPT, ALLOWED_LABEL } from "@/lib/media";
import { Progress } from "@/components/ui/progress";

import { CATEGORIES } from "@/data/site";

export const Route = createFileRoute("/_authenticated/admin/projects/$id")({
  component: ProjectEditor,
});

interface Form {
  slug: string;
  name: string;
  location: string;
  style: string;
  project_type: string;
  categories: string[];
  description: string;
  scope: string;
  duration: string;
  year: string;
  cover_url: string;
  before_url: string;
  after_url: string;
  sort_order: number;
  published: boolean;
}

const EMPTY: Form = {
  slug: "",
  name: "",
  location: "",
  style: "",
  project_type: "",
  categories: [],
  description: "",
  scope: "",
  duration: "",
  year: String(new Date().getFullYear()),
  cover_url: "",
  before_url: "",
  after_url: "",
  sort_order: 99,
  published: false,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function ProjectEditor() {
  const { id } = useParams({ from: "/_authenticated/admin/projects/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<Form>(EMPTY);
  const [gallery, setGallery] = useState<{ id?: string; url: string; alt: string }[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      if (data) {
        setForm({
          slug: data.slug,
          name: data.name,
          location: data.location,
          style: data.style,
          project_type: data.project_type,
          categories: data.categories ?? [],
          description: data.description,
          scope: (data.scope ?? []).join("\n"),
          duration: data.duration,
          year: data.year,
          cover_url: data.cover_url,
          before_url: data.before_url ?? "",
          after_url: data.after_url ?? "",
          sort_order: data.sort_order,
          published: data.published,
        });
      }
      const { data: imgs } = await supabase
        .from("project_images")
        .select("id, url, alt")
        .eq("project_id", id)
        .order("sort_order");
      setGallery(imgs ?? []);
      setLoading(false);
    })();
  }, [id, isNew]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const firstGallery = gallery.find((g) => g.url.trim())?.url.trim() ?? "";
      const payload = {
        slug: form.slug || slugify(form.name),
        name: form.name,
        location: form.location,
        style: form.style,
        project_type: form.project_type,
        categories: form.categories,
        description: form.description,
        scope: form.scope
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        duration: form.duration,
        year: form.year,
        cover_url: form.cover_url || firstGallery,
        before_url: form.before_url || null,
        after_url: form.after_url || null,
        sort_order: Number(form.sort_order) || 0,
        published: form.published,
      };

      let projectId = id;
      if (isNew) {
        const { data, error: err } = await supabase
          .from("projects")
          .insert(payload)
          .select("id")
          .single();
        if (err) throw err;
        projectId = data.id;
      } else {
        const { error: err } = await supabase.from("projects").update(payload).eq("id", id);
        if (err) throw err;
      }

      await supabase.from("project_images").delete().eq("project_id", projectId);
      const rows = gallery
        .filter((g) => g.url.trim())
        .map((g, i) => ({
          project_id: projectId,
          url: g.url.trim(),
          alt: g.alt || `${form.name} interior detail`,
          sort_order: i,
        }));
      if (rows.length) {
        const { error: imgErr } = await supabase.from("project_images").insert(rows);
        if (imgErr) throw imgErr;
      }

      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this project.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading project…</p>;

  return (
    <form onSubmit={save} className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground hover:text-accent"
          >
            <ArrowLeft size={14} /> Back to projects
          </Link>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">
            {isNew ? "New project" : form.name || "Edit project"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} />
            Published
          </label>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save project"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="grid gap-5 rounded-3xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
        <Field label="Project name">
          <Input
            required
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (isNew) set("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="URL slug">
          <Input required value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Style">
          <Input value={form.style} onChange={(e) => set("style", e.target.value)} />
        </Field>
        <Field label="Project type">
          <Input value={form.project_type} onChange={(e) => set("project_type", e.target.value)} />
        </Field>
        <Field label="Duration">
          <Input value={form.duration} onChange={(e) => set("duration", e.target.value)} />
        </Field>
        <Field label="Year">
          <Input value={form.year} onChange={(e) => set("year", e.target.value)} />
        </Field>
        <Field label="Order on portfolio">
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
          />
        </Field>

        <div className="md:col-span-2">
          <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Categories
          </Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = form.categories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    set(
                      "categories",
                      active
                        ? form.categories.filter((x) => x !== c)
                        : [...form.categories, c],
                    )
                  }
                  className={`rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "border border-border text-muted-foreground hover:border-accent"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Description" className="md:col-span-2">
          <Textarea
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        <Field label="Scope — one item per line" className="md:col-span-2">
          <Textarea rows={5} value={form.scope} onChange={(e) => set("scope", e.target.value)} />
        </Field>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-display text-xl">Imagery</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The cover image is what shows on the portfolio grid. Leave it empty and the first gallery
          image is used automatically. Only published projects appear on the website.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <MediaPicker
            label="Cover image"
            value={form.cover_url}
            onChange={(v) => set("cover_url", v)}
          />
          <MediaPicker
            label="Before image (optional)"
            value={form.before_url}
            onChange={(v) => set("before_url", v)}
          />
          <MediaPicker
            label="After image (optional)"
            value={form.after_url}
            onChange={(v) => set("after_url", v)}
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <h3 className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Gallery</h3>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.14em] hover:border-accent">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload images
            <input
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                if (!files.length) return;
                setUploading(true);
                setError(null);
                try {
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const invalid = validateImage(file);
                    if (invalid) throw new Error(invalid);
                    setUploadStatus(`${file.name} (${i + 1}/${files.length})`);
                    setUploadPct(0);
                    const asset = await uploadMedia(file, "projects", setUploadPct);
                    setGallery((list) => [...list, { url: asset.url, alt: "" }]);
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload failed");
                } finally {
                  setUploading(false);
                  setUploadStatus(null);
                  setUploadPct(0);
                }
              }}
            />
          </label>
          <span className="text-[0.65rem] text-muted-foreground">
            {ALLOWED_LABEL} · max {formatBytes(MAX_FILE_BYTES)}
          </span>
        </div>
        {uploading && (
          <div className="mt-3 max-w-sm space-y-1">
            <Progress value={uploadPct} />
            <p className="text-[0.7rem] text-muted-foreground">
              Uploading {uploadStatus} — {uploadPct}%
            </p>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {gallery.map((g, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3">
              <img
                src={g.url}
                alt=""
                className="h-12 w-16 shrink-0 rounded-lg bg-muted object-cover"
                loading="lazy"
              />
              <div className="min-w-[16rem] flex-1">
                <MediaPicker
                  label="Image"
                  value={g.url}
                  onChange={(v) =>
                    setGallery((list) =>
                      list.map((item, idx) => (idx === i ? { ...item, url: v } : item)),
                    )
                  }
                />
              </div>
              <Input
                className="min-w-[12rem] flex-1"
                placeholder="Alt text"
                value={g.alt}
                onChange={(e) =>
                  setGallery((list) =>
                    list.map((item, idx) => (idx === i ? { ...item, alt: e.target.value } : item)),
                  )
                }
              />
              <Button
                type="button"
                variant={form.cover_url === g.url && g.url ? "default" : "outline"}
                size="sm"
                disabled={!g.url}
                onClick={() => set("cover_url", g.url)}
              >
                {form.cover_url === g.url && g.url ? "Cover" : "Use as cover"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGallery((list) => list.filter((_, idx) => idx !== i))}
              >
                <Trash2 size={15} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setGallery((list) => [...list, { url: "", alt: "" }])}
          >
            <Plus size={15} /> Add image
          </Button>
        </div>
      </section>

    </form>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
