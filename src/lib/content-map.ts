import type { Database } from "@/integrations/supabase/types";
import type { Service } from "@/data/site";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];
type PageSectionRow = Database["public"]["Tables"]["page_sections"]["Row"];

export type TestimonialCopy = { quote: string; name: string; detail: string };
export type PageCopy = {
  section_key: string;
  eyebrow: string;
  title: string;
  body: string;
  image_url: string;
};

export function toService(row: ServiceRow): Service {
  return {
    id: row.slug,
    icon: row.icon || "Home",
    title: row.title,
    short: row.summary || row.description || "",
    description: row.description || row.summary || "",
    includes: row.bullets ?? [],
    image: row.image_url || "",
  };
}

export function toTestimonial(row: TestimonialRow): TestimonialCopy {
  return {
    quote: row.quote,
    name: row.name,
    detail: row.detail || row.project_name || "",
  };
}

export function toPageCopy(row: PageSectionRow): PageCopy {
  return {
    section_key: row.section_key,
    eyebrow: row.eyebrow ?? "",
    title: row.title ?? "",
    body: row.body ?? "",
    image_url: row.image_url ?? "",
  };
}

/** Picks a field from a page section, falling back to the bundled copy. */
export function copyOf(
  sections: PageCopy[] | undefined,
  sectionKey: string,
  field: "eyebrow" | "title" | "body" | "image_url",
  fallback: string,
) {
  const v = sections?.find((s) => s.section_key === sectionKey)?.[field];
  return v && v.length ? v : fallback;
}
