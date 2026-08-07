import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string;
  category: string;
  author: string;
  published_at: string | null;
};

export type PostFull = PostSummary & {
  content: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
};

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

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PostSummary[]> => {
    try {
      const { data } = await publicClient()
        .from("blog_posts")
        .select("slug, title, excerpt, cover_url, category, author, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    } catch {
      return [];
    }
  },
);

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<PostFull | null> => {
    try {
      const { data: row } = await publicClient()
        .from("blog_posts")
        .select(
          "slug, title, excerpt, cover_url, category, author, published_at, content, tags, seo_title, seo_description",
        )
        .eq("published", true)
        .eq("slug", data.slug)
        .maybeSingle();
      return row ?? null;
    } catch {
      return null;
    }
  });
