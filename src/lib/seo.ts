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
