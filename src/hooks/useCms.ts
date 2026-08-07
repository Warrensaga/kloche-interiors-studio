import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FALLBACK_CONFIG,
  FALLBACK_FOOTER_NAV,
  FALLBACK_NAV,
  toConfig,
  type SiteConfig,
} from "@/lib/cms";

/** Site-wide business details. Renders the bundled defaults until the live data arrives. */
export function useSiteConfig(): SiteConfig {
  const { data } = useQuery({
    queryKey: ["cms", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
  return toConfig(data ?? null) ?? FALLBACK_CONFIG;
}

export function useNav(location: "header" | "footer") {
  const { data } = useQuery({
    queryKey: ["cms", "nav", location],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nav_items")
        .select("id, label, href, sort_order, visible, location")
        .eq("location", location)
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const fallback = location === "header" ? FALLBACK_NAV : FALLBACK_FOOTER_NAV;
  if (!data?.length) return fallback;
  return data.map((d) => ({ label: d.label, href: d.href }));
}

/** Editable sections for a public page, keyed by section_key. */
export function usePageSections(pageKey: string) {
  const { data } = useQuery({
    queryKey: ["cms", "page", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_key", pageKey)
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const map = new Map((data ?? []).map((s) => [s.section_key, s]));
  return {
    sections: data ?? [],
    /** Returns the stored copy for a section, or the bundled fallback. */
    text(sectionKey: string, field: "eyebrow" | "title" | "body", fallback: string) {
      const v = map.get(sectionKey)?.[field];
      return v && v.length ? v : fallback;
    },
  };
}
