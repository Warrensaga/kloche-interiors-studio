import { createServerFn } from "@tanstack/react-start";
import { publicSupabase } from "@/lib/public-supabase";
import { hasServerSupabaseEnv } from "@/lib/supabase-env";
import {
  toPageCopy,
  toService,
  toTestimonial,
  type PageCopy,
  type TestimonialCopy,
} from "@/lib/content-map";
import { SERVICES, TESTIMONIALS, type Service } from "@/data/site";

/** Visible services in display order. Falls back to bundled copy. */
export const listServices = createServerFn({ method: "GET" }).handler(
  async (): Promise<Service[]> => {
    if (!hasServerSupabaseEnv()) return SERVICES;
    try {
      const { data } = await publicSupabase()
        .from("services")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (!data?.length) return SERVICES;
      return data.map(toService);
    } catch {
      return SERVICES;
    }
  },
);

/** Visible testimonials in display order. Falls back to bundled copy. */
export const listTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<TestimonialCopy[]> => {
    if (!hasServerSupabaseEnv()) return TESTIMONIALS;
    try {
      const { data } = await publicSupabase()
        .from("testimonials")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (!data?.length) return TESTIMONIALS;
      return data.map(toTestimonial);
    } catch {
      return TESTIMONIALS;
    }
  },
);

/** Editable copy blocks for a public page, keyed by section_key. */
export const listPageCopy = createServerFn({ method: "GET" })
  .inputValidator((pageKey: string) => pageKey)
  .handler(async ({ data: pageKey }): Promise<PageCopy[]> => {
    if (!hasServerSupabaseEnv()) return [];
    try {
      const { data } = await publicSupabase()
        .from("page_sections")
        .select("*")
        .eq("page_key", pageKey)
        .eq("visible", true)
        .order("sort_order");
      return (data ?? []).map(toPageCopy);
    } catch {
      return [];
    }
  });
