// Single place to change the site origin (e.g. when a custom domain is connected).
export const BASE_URL = "https://kloche-interiors-studio.vercel.app";

/** Build an absolute URL for canonical / og:url tags. */
export const absoluteUrl = (path: string) =>
  `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
