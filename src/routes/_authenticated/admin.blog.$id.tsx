import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminHeading } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { slugify } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({
  component: AdminBlogEditor,
});

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  category: string;
  tags: string;
  author: string;
  seo_title: string;
  seo_description: string;
  published: boolean;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: "",
  category: "",
  tags: "",
  author: "Kloche Interiors",
  seo_title: "",
  seo_description: "",
  published: false,
};

function AdminBlogEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "post", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      cover_url: data.cover_url,
      category: data.category,
      tags: data.tags.join(", "),
      author: data.author,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      published: data.published,
    });
  }, [data]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_url: form.cover_url,
      category: form.category,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author: form.author,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      published: form.published,
      published_at: form.published ? (data?.published_at ?? new Date().toISOString()) : null,
    };
    const res = isNew
      ? await supabase.from("blog_posts").insert(payload)
      : await supabase.from("blog_posts").update(payload).eq("id", id);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    navigate({ to: "/admin/blog" });
  }

  return (
    <>
      <AdminHeading
        eyebrow="Journal"
        title={isNew ? "New post" : "Edit post"}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/admin/blog" })}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving || !form.title}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <Input
            value={form.title}
            placeholder="Title"
            onChange={(e) => set("title", e.target.value)}
            className="text-lg"
          />
          <Input
            value={form.slug}
            placeholder="url-slug (auto)"
            onChange={(e) => set("slug", slugify(e.target.value))}
          />
          <Textarea
            rows={3}
            value={form.excerpt}
            placeholder="Short excerpt"
            onChange={(e) => set("excerpt", e.target.value)}
          />
          <Textarea
            rows={18}
            value={form.content}
            placeholder="Write the article. Leave a blank line between paragraphs."
            onChange={(e) => set("content", e.target.value)}
          />
        </section>

        <aside className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <MediaPicker label="Featured image" value={form.cover_url} onChange={(v) => set("cover_url", v)} />
          <Input value={form.category} placeholder="Category" onChange={(e) => set("category", e.target.value)} />
          <Input value={form.tags} placeholder="Tags, comma separated" onChange={(e) => set("tags", e.target.value)} />
          <Input value={form.author} placeholder="Author" onChange={(e) => set("author", e.target.value)} />
          <Input
            value={form.seo_title}
            placeholder="SEO title"
            onChange={(e) => set("seo_title", e.target.value)}
          />
          <Textarea
            rows={3}
            value={form.seo_description}
            placeholder="Meta description"
            onChange={(e) => set("seo_description", e.target.value)}
          />
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} />
            Published
          </label>
        </aside>
      </div>
    </>
  );
}
