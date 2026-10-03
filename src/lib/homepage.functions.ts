import { serverSupabaseKey, serverSupabaseUrl } from "@/lib/supabase-env";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { hasServerSupabaseEnv } from "@/lib/supabase-env";

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

const sec = (
  sort_order: number,
  section_key: string,
  kind: SectionKind,
  eyebrow: string,
  title: string,
  body: string,
  content: SectionContent = {},
): HomepageSection => ({ id: section_key, section_key, kind, eyebrow, title, body, content, sort_order, visible: true });

/** Mirrors the CMS rows so visitors still see every section if the database is unreachable. */
export const DEFAULT_SECTIONS: HomepageSection[] = [
  sec(0, "hero", "hero", "Interior Design Studio · Nairobi, Kenya", "Where style meets lifestyle",
    "interior design, construction and renovation experts transforming spaces across kenya and Beyond",
    { ctaLabel: "Start Your Transformation", showWhatsapp: true }),
  sec(1, "studio", "richtext", "The Studio", "We transform spaces into places you love to live in",
    "Kloche Interiors & Construction is a premier interior design studio based in Westlands, Nairobi, dedicated to creating thoughtful, functional spaces.",
    { linkLabel: "Our story", paragraphs: ["Kloche Interiors & Construction is an interior design and construction company dedicated to creating thoughtful, functional and beautifully considered spaces. We work across residential and commercial projects, bringing together interior design, renovation and construction expertise to create spaces that reflect the people who use them. From the first idea and initial concept to the final finish, we manage the details that turn a space into something truly personal. Our approach combines creativity with practical execution, ensuring that every project is designed with purpose and delivered with care. Because to us, great interiors aren"t simply about how a space looks. They"re about how it makes you feel and how well it serves the life lived within it."] }),
  sec(2, "projects", "projects", "Selected Work", "Featured projects", "A few recent spaces we have transformed.",
    { limit: 6, linkLabel: "View full portfolio" }),
  sec(3, "services", "services", "What We Do", "Services", "", { linkLabel: "See all services" }),
  sec(4, "pillars", "pillars", "Why Kloche?", "Four pillars we work by", ""),
  sec(5, "stats", "stats", "By The Numbers", "A studio built on delivery", "", {
    items: [
      { label: "Projects delivered", value: "20+" },
      { label: "Years in practice", value: "8" },
      { label: "Kenyan artisans engaged", value: "40+" },
      { label: "& beyond", value: "Nairobi" },
    ],
  }),
  sec(6, "philosophy", "philosophy", "The Studio", "We transform spaces into places you love to live in.",
    "We believe the best spaces are not simply beautiful. They are intentional, functional and personal. At Kloche, we design around the way you live, work and experience your space — bringing together style, comfort and purpose to create interiors that feel uniquely yours."),
  sec(7, "testimonials", "testimonials", "Kind Words", "", ""),
  sec(8, "cta", "cta", "", "Ready to transform your space?",
    "Tell us about your home or workplace. We'll come back within two working days with next steps and a realistic budget range."),
];

function publicClient() {
  const key = serverSupabaseKey();
  return createClient<Database>(serverSupabaseUrl(), key, {
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
    if (!hasServerSupabaseEnv()) return DEFAULT_SECTIONS;
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
