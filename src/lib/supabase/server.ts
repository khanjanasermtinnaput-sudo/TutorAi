// Server-side Supabase client for Server Components / Route Handlers.
// Reads/writes the session via next/headers cookies() so it stays in sync
// with the browser client and middleware.ts.

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — session refresh is handled by
          // middleware.ts instead, so this is safe to ignore.
        }
      },
    },
  });
}

/** Service-role client for privileged server-only operations (e.g. writing
 * shared topic_summaries cache entries). Never import this from client code. */
export async function createServiceRoleClient() {
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  return createSupabaseClient<Database>(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
