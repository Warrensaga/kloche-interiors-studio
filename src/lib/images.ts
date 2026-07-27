const DEFAULT_WIDTHS = [400, 640, 828, 1080, 1400, 1920, 2400];

/** True for the Unsplash CDN URLs used across the site. */
function isUnsplash(url: string) {
  return url.startsWith("https://images.unsplash.com/");
}

/** Rewrite an Unsplash URL to a specific rendered width. */
export function imageAt(url: string, width: number): string {
  if (!isUnsplash(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    u.searchParams.set("w", String(width));
    if (!u.searchParams.get("q")) u.searchParams.set("q", "80");
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Build a width-descriptor srcset. Widths above the source's own rendered
 * width are still valid — Unsplash resizes from the original asset.
 */
export function srcSet(url: string, widths: number[] = DEFAULT_WIDTHS): string | undefined {
  if (!isUnsplash(url)) return undefined;
  return widths.map((w) => `${imageAt(url, w)} ${w}w`).join(", ");
}

/** Common `sizes` presets matching the site's grid breakpoints. */
export const SIZES = {
  full: "100vw",
  half: "(min-width: 768px) 50vw, 100vw",
  third: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  quarter: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  content: "(min-width: 1024px) 50vw, (min-width: 640px) 90vw, 100vw",
} as const;
