import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { serverSupabaseKey, serverSupabaseUrl } from "@/lib/supabase-env";

/**
 * Publishable-key Supabase client for server-side public reads.
 * Env is read inside the function so nothing is captured at module scope.
 */
export function publicSupabase() {
  const key = serverSupabaseKey();
  return createClient<Database>(serverSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}
