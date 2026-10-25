import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Paths served as-is on every host (not rewritten into /book on the booking domain).
const SHARED_PREFIXES = ["/_next", "/api", "/images", "/fonts", "/icon", "/admin", "/portal", "/review"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").toLowerCase();
  const bookingPrefix = process.env.BOOKING_HOST_PREFIX ?? "booking.";

  // booking.michaelmusyoka.com/* → /book/*
  if (host.startsWith(bookingPrefix) && !pathname.startsWith("/book") && !SHARED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = `/book${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  const isAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isPortal =
    pathname.startsWith("/portal") && pathname !== "/portal/login" && !pathname.startsWith("/portal/invite");

  if (isAdmin || isPortal) {
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    const ok = isAdmin ? session?.role === "admin" : session?.role === "client";
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = isAdmin ? "/admin/login" : "/portal/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
