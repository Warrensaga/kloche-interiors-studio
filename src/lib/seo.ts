// Single place to change the site origin (e.g. when a custom domain is connected).
export const BASE_URL = "https://www.klocheinteriors.co.ke";

/** Build an absolute URL for canonical / og:url tags. */
export const absoluteUrl = (path: string) =>
  `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export type Crumb = { name: string; path: string };

/**
 * Build a schema.org BreadcrumbList JSON-LD script entry for a route's head().
 * Always start the trail at Home.
 */
export const breadcrumbLd = (trail: Crumb[]) => ({
  type: "application/ld+json",
  children: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }),
});

/** Admin-editable overrides stored in the CMS (`seo_meta`). */
export type SeoOverride = {
  title?: string | null;
  description?: string | null;
  og_image?: string | null;
  canonical?: string | null;
  schema_json?: string | null;
  noindex?: boolean | null;
} | null;

const clean = (v: string | null | undefined) => (typeof v === "string" ? v.trim() : "");

/**
 * Merge a route's built-in metadata with admin overrides from the CMS.
 * Blank override fields always fall back to the built-in defaults.
 */
export function pageSeo(opts: {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  type?: string;
  override?: SeoOverride;
}) {
  const o = opts.override ?? null;
  const title = clean(o?.title) || opts.title;
  const description = clean(o?.description) || opts.description;
  const image = clean(o?.og_image) || opts.image || "";
  const canonical = clean(o?.canonical) || absoluteUrl(opts.path);
  const ogTitle = clean(o?.title) || opts.ogTitle || opts.title;
  const ogDescription = clean(o?.description) || opts.ogDescription || opts.description;

  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:url", content: canonical },
    { property: "og:type", content: opts.type ?? "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: ogTitle },
    { name: "twitter:description", content: ogDescription },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  if (o?.noindex) meta.push({ name: "robots", content: "noindex, nofollow" });

  const scripts: { type: string; children: string }[] = [];
  const extra = clean(o?.schema_json);
  if (extra) {
    try {
      JSON.parse(extra);
      scripts.push({ type: "application/ld+json", children: extra });
    } catch {
      /* ignore invalid JSON from the editor */
    }
  }

  return { meta, links: [{ rel: "canonical", href: canonical }], scripts };
}
