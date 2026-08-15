/**
 * Environment guards so the site degrades to bundled content instead of
 * returning HTTP 500 when the backend env vars are missing on a host.
 *
 * Diagnostics here log VARIABLE NAMES ONLY — never values — so a
 * misconfigured deployment (e.g. Vercel missing SUPABASE_URL) is obvious in
 * the server logs without leaking secrets.
 */

const REQUIRED_SERVER_VARS = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"] as const;
const REQUIRED_BROWSER_VARS = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;

/** Log the same missing-env warning at most once per interval per scope. */
const LOG_INTERVAL_MS = 60_000;
const lastLoggedAt = new Map<string, number>();

function logOnce(scope: string, message: string) {
  const now = Date.now();
  const previous = lastLoggedAt.get(scope);
  if (previous !== undefined && now - previous < LOG_INTERVAL_MS) return;
  lastLoggedAt.set(scope, now);
  console.error(message);
}

function readServerEnv(name: string): string | undefined {
  try {
    return typeof process !== "undefined" ? process.env?.[name] : undefined;
  } catch {
    return undefined;
  }
}

/** Names of required server env vars that are absent or empty. Never returns values. */
export function missingServerSupabaseEnv(): string[] {
  return REQUIRED_SERVER_VARS.filter((name) => !readServerEnv(name));
}

/** Names of required browser env vars that are absent or empty. Never returns values. */
export function missingBrowserSupabaseEnv(): string[] {
  return REQUIRED_BROWSER_VARS.filter((name) => {
    try {
      const viteValue = import.meta.env[name as keyof ImportMetaEnv];
      const fallback = readServerEnv(name.replace(/^VITE_/, ""));
      return !(viteValue || fallback);
    } catch {
      return true;
    }
  });
}

/** True when server-side Supabase env vars are present (server functions / SSR). */
export function hasServerSupabaseEnv(): boolean {
  const missing = missingServerSupabaseEnv();
  if (missing.length) {
    logOnce(
      "server",
      `[env] Missing server environment variables: ${missing.join(", ")}. ` +
        "Serving bundled fallback content. Set these in your hosting provider's " +
        "environment settings (Production + Preview) and redeploy without build cache.",
    );
    return false;
  }
  return true;
}

/** True when browser-side Supabase env vars are present. */
export function hasBrowserSupabaseEnv(): boolean {
  const missing = missingBrowserSupabaseEnv();
  if (missing.length) {
    logOnce(
      "browser",
      `[env] Missing client environment variables: ${missing.join(", ")}. ` +
        "Live content updates are disabled; bundled content is shown instead.",
    );
    return false;
  }
  return true;
}

/**
 * Runs a data fetch and falls back to bundled content on any failure
 * (missing env vars, network error, server-function 500).
 */
export async function safeLoad<T>(load: () => Promise<T>, fallback: T, label?: string): Promise<T> {
  try {
    return await load();
  } catch (error) {
    const missing = missingServerSupabaseEnv();
    const where = label ? ` (${label})` : "";
    const cause = missing.length
      ? `missing environment variables: ${missing.join(", ")}`
      : "runtime error";
    console.error(`[data]${where} falling back to bundled content — ${cause}:`, error);
    return fallback;
  }
}
