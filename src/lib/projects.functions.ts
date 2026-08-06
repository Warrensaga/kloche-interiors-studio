import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { PROJECTS, type Category, type Project } from "@/data/site";

type Row = Database["public"]["Tables"]["projects"]["Row"];
type ImageRow = Database["public"]["Tables"]["project_images"]["Row"];

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export function toProject(row: Row, images: ImageRow[]): Project {
  const gallery = images
    .filter((i) => i.project_id === row.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);

  return {
    id: row.slug,
    name: row.name,
    location: row.location ?? "",
    style: row.style ?? "",
    projectType: row.project_type ?? "",
    categories: (row.categories ?? []) as Category[],
    cover: row.cover_url ?? gallery[0] ?? "",
    gallery: gallery.length ? gallery : row.cover_url ? [row.cover_url] : [],
    description: row.description ?? "",
    scope: row.scope ?? [],
    duration: row.duration ?? "",
    year: row.year ?? "",
    ...(row.before_url && row.after_url
      ? { beforeAfter: { before: row.before_url, after: row.after_url } }
      : {}),
  };
}

/** Published projects, newest ordering by sort_order. Falls back to bundled data. */
export const listPublishedProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Project[]> => {
    try {
      const supabase = publicClient();
      const [{ data: rows }, { data: images }] = await Promise.all([
        supabase.from("projects").select("*").eq("published", true).order("sort_order"),
        supabase.from("project_images").select("*"),
      ]);
      if (!rows?.length) return PROJECTS;
      return rows.map((r) => toProject(r, images ?? []));
    } catch {
      return PROJECTS;
    }
  },
);
