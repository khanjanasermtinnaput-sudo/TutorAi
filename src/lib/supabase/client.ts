// Browser Supabase client — mirrors session into cookies (not just localStorage)
// via @supabase/ssr so middleware.ts's server-side session check sees the same
// session. A plain @supabase/supabase-js createClient here would desync from
// middleware and cause spurious redirects to /login.

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // /auth/callback exchanges the OAuth code explicitly — auto-detection
      // would try to exchange it a second time and throw "code already used".
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });
}
