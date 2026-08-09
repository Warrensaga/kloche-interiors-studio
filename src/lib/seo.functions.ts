import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { SeoOverride } from "@/lib/seo";

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

/** Admin-managed SEO overrides for one page key. Returns null when unset. */
export const getSeoMeta = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: pageKey }): Promise<SeoOverride> => {
    try {
      const supabase = publicClient();
      const { data } = await supabase
        .from("seo_meta")
        .select("title, description, og_image, canonical, schema_json, noindex")
        .eq("page_key", pageKey)
        .maybeSingle();
      return (data as SeoOverride) ?? null;
    } catch {
      return null;
    }
  });
