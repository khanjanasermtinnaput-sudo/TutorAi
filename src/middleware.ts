import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Paths reachable without a session.
const PUBLIC_PREFIXES = ["/login", "/api/auth/callback", "/api/stripe/webhook"];

// Stripe's servers call this cross-origin with no ambient cookie session —
// it authenticates via signature verification instead, so it's exempt from
// both the auth guard above and the CSRF origin check below.
const CSRF_EXEMPT_PREFIXES = ["/api/stripe/webhook"];
const CSRF_SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isTrustedOrigin(origin: string | null, requestUrl: string): boolean {
  if (!origin) return true; // non-browser callers have no ambient cookie to forge with
  try {
    const req = new URL(requestUrl);
    const org = new URL(origin);
    if (org.host === req.host) return true;
    const allowed = (process.env.NEXT_PUBLIC_APP_URL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    return allowed.includes(origin);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") &&
    !CSRF_SAFE_METHODS.has(request.method) &&
    !CSRF_EXEMPT_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    const origin = request.headers.get("origin");
    if (!isTrustedOrigin(origin, request.url)) {
      return new NextResponse(JSON.stringify({ error: "forbidden", message: "Cross-origin request rejected" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  const { response, user, supabase } = await updateSession(request);

  if (isPublic) return response;

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    const onboarded = profile?.onboarding_completed ?? false;
    if (!onboarded && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (onboarded && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
