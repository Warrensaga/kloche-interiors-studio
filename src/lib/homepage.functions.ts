import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type SectionKind =
  | "hero"
  | "richtext"
  | "projects"
  | "services"
  | "pillars"
  | "stats"
  | "philosophy"
  | "testimonials"
  | "cta";

export type StatItem = { value: string; label: string };
export type TestimonialItem = { quote: string; name: string; detail: string };

export type SectionContent = {
  paragraphs?: string[];
  items?: (StatItem | TestimonialItem)[];
  linkLabel?: string;
  ctaLabel?: string;
  showWhatsapp?: boolean;
  limit?: number;
  imageUrl?: string;
};

export type HomepageSection = {
  id: string;
  section_key: string;
  kind: SectionKind;
  eyebrow: string;
  title: string;
  body: string;
  content: SectionContent;
  sort_order: number;
  visible: boolean;
};

export const DEFAULT_SECTIONS: HomepageSection[] = [
  {
    id: "hero",
    section_key: "hero",
    kind: "hero",
    eyebrow: "Interior Design Studio · Nairobi, Kenya",
    title: "Interiors that feel like home",
    body: "At Kloche Interiors & Construction, we design and transform spaces that feel as good as they look.",
    content: { ctaLabel: "Start Your Transformation", showWhatsapp: true },
    sort_order: 0,
    visible: true,
  },
];

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

/** Visible homepage sections in display order. Falls back to bundled defaults. */
export const listHomepageSections = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomepageSection[]> => {
    try {
      const supabase = publicClient();
      const { data } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (!data?.length) return DEFAULT_SECTIONS;
      return data.map((r) => ({
        id: r.id,
        section_key: r.section_key,
        kind: r.kind as SectionKind,
        eyebrow: r.eyebrow ?? "",
        title: r.title ?? "",
        body: r.body ?? "",
        content: (r.content ?? {}) as SectionContent,
        sort_order: r.sort_order,
        visible: r.visible,
      }));
    } catch {
      return DEFAULT_SECTIONS;
    }
  },
);
