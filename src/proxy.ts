import { NextResponse, type NextRequest } from "next/server";

// Optimistic edge-level guard for the admin area. Auth.js stores the JWT
// session in a cookie named `authjs.session-token` (HTTP) or
// `__Secure-authjs.session-token` (HTTPS). Presence of either means the user
// likely has a session; the authoritative check still happens server-side in
// `requireAdmin()` (see `src/lib/auth-guard.ts`). This only avoids rendering
// protected pages for clearly signed-out visitors and must never be treated
// as the sole authorization boundary.
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasSession = SESSION_COOKIES.some((name) => request.cookies.get(name)?.value);

  if (!hasSession) {
    const url = new URL("/admin/login", request.url);
    if (pathname.startsWith("/admin/")) {
      url.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
