import type { Database } from "@/integrations/supabase/types";
import { STUDIO } from "@/data/site";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type NavItem = Database["public"]["Tables"]["nav_items"]["Row"];
export type PageSection = Database["public"]["Tables"]["page_sections"]["Row"];
export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];

export type Hour = { day: string; time: string };
export type Socials = {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  linkedin?: string;
};

/** Shape used by the UI; always defined so the site never renders empty. */
export type SiteConfig = {
  businessName: string;
  tagline: string;
  email: string;
  phoneDisplay: string;
  phoneLink: string;
  whatsapp: string;
  address: string;
  mapsUrl: string;
  hours: Hour[];
  logoUrl: string;
  socials: Socials;
  footerBlurb: string;
  copyright: string;
  headerCtaLabel: string;
};

export const FALLBACK_CONFIG: SiteConfig = {
  businessName: STUDIO.name,
  tagline: STUDIO.tagline,
  email: STUDIO.email,
  phoneDisplay: "0717 634003",
  phoneLink: "+254717634003",
  whatsapp: STUDIO.whatsapp,
  address: STUDIO.address,
  mapsUrl: "https://maps.google.com/?q=Karuna+Road+Nairobi",
  hours: STUDIO.hours,
  logoUrl: "",
  socials: {
    instagram: STUDIO.instagram,
    tiktok: STUDIO.tiktok,
    facebook: STUDIO.facebook,
    linkedin: STUDIO.linkedin,
  },
  footerBlurb:
    "A Nairobi interior design studio making warm, considered homes and workplaces across Kenya.",
  copyright: "Kloche Interiors. All rights reserved.",
  headerCtaLabel: "Start Your Transformation",
};

export function toConfig(row: SiteSettings | null | undefined): SiteConfig {
  if (!row) return FALLBACK_CONFIG;
  return {
    businessName: row.business_name || FALLBACK_CONFIG.businessName,
    tagline: row.tagline || FALLBACK_CONFIG.tagline,
    email: row.email || FALLBACK_CONFIG.email,
    phoneDisplay: row.phone_display || FALLBACK_CONFIG.phoneDisplay,
    phoneLink: row.phone_link || FALLBACK_CONFIG.phoneLink,
    whatsapp: row.whatsapp || FALLBACK_CONFIG.whatsapp,
    address: row.address || FALLBACK_CONFIG.address,
    mapsUrl: row.maps_url || FALLBACK_CONFIG.mapsUrl,
    hours: (Array.isArray(row.hours) ? (row.hours as unknown as Hour[]) : FALLBACK_CONFIG.hours),
    logoUrl: row.logo_url || "",
    socials: ((row.socials ?? {}) as Socials),
    footerBlurb: row.footer_blurb || FALLBACK_CONFIG.footerBlurb,
    copyright: row.copyright || FALLBACK_CONFIG.copyright,
    headerCtaLabel: row.header_cta_label || FALLBACK_CONFIG.headerCtaLabel,
  };
}

export const waLink = (whatsapp: string, message: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

export const FALLBACK_NAV = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const FALLBACK_FOOTER_NAV = FALLBACK_NAV.filter((n) => n.href !== "/");

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const PAGE_KEYS = [
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "portfolio", label: "Portfolio" },
  { key: "pricing", label: "Pricing" },
  { key: "contact", label: "Contact" },
] as const;
