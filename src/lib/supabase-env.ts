/**
 * Environment guards so the site degrades to bundled content instead of
 * returning HTTP 500 when the backend env vars are missing on a host.
 */

/** True when server-side Supabase env vars are present (server functions / SSR). */
export function hasServerSupabaseEnv(): boolean {
  try {
    return Boolean(process.env["SUPABASE_URL"] && process.env["SUPABASE_PUBLISHABLE_KEY"]);
  } catch {
    return false;
  }
}

/** True when browser-side Supabase env vars are present. */
export function hasBrowserSupabaseEnv(): boolean {
  try {
    const url =
      import.meta.env["VITE_SUPABASE_URL"] ||
      (typeof process !== "undefined" ? process.env?.["SUPABASE_URL"] : undefined);
    const key =
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      (typeof process !== "undefined" ? process.env?.["SUPABASE_PUBLISHABLE_KEY"] : undefined);
    return Boolean(url && key);
  } catch {
    return false;
  }
}

/**
 * Runs a data fetch and falls back to bundled content on any failure
 * (missing env vars, network error, server-function 500).
 */
export async function safeLoad<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.error("[data] falling back to bundled content:", error);
    return fallback;
  }
}
