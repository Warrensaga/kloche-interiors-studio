const DEFAULT_WIDTHS = [320, 400, 640, 828, 1080, 1400, 1920, 2400];

export type ImageFormat = "avif" | "webp" | "auto";

/** True for the Unsplash CDN URLs used across the site. */
function isUnsplash(url: string) {
  return url.startsWith("https://images.unsplash.com/");
}

/** Signed object URLs from the project's own storage bucket. */
function isStorage(url: string) {
  return url.includes("/storage/v1/object/sign/");
}

export function isOptimizable(url: string) {
  return isUnsplash(url);
}

/**
 * Rewrite an Unsplash URL to a specific rendered width and (optionally) an
 * explicit modern format. `auto` lets the CDN content-negotiate.
 */
export function imageAt(url: string, width: number, format: ImageFormat = "auto"): string {
  if (isStorage(url)) {
    // Storage's render endpoint content-negotiates WebP/AVIF and resizes.
    try {
      const u = new URL(url.replace("/object/sign/", "/render/image/sign/"));
      u.searchParams.set("width", String(Math.min(Math.round(width), 2000)));
      u.searchParams.set("resize", "contain");
      u.searchParams.set("quality", "75");
      return u.toString();
    } catch {
      return url;
    }
  }
  if (!isUnsplash(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", "crop");
    u.searchParams.set("w", String(width));
    if (!u.searchParams.get("q")) u.searchParams.set("q", "75");
    if (format === "auto") u.searchParams.delete("fm");
    else u.searchParams.set("fm", format);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Build a width-descriptor srcset. Widths above the source's own rendered
 * width are still valid — Unsplash resizes from the original asset.
 */
export function srcSet(
  url: string,
  widths: number[] = DEFAULT_WIDTHS,
  format: ImageFormat = "auto",
): string | undefined {
  if (!isUnsplash(url)) return undefined;
  return widths.map((w) => `${imageAt(url, w, format)} ${w}w`).join(", ");
}

/** Common `sizes` presets matching the site's grid breakpoints. */
export const SIZES = {
  full: "100vw",
  half: "(min-width: 768px) 50vw, 100vw",
  third: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  quarter: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  content: "(min-width: 1024px) 50vw, (min-width: 640px) 90vw, 100vw",
} as const;

export { DEFAULT_WIDTHS };
