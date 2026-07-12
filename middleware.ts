import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isAuthenticatedRequest } from "@/lib/auth";

function buildLoginRedirect(request: NextRequest): URL {
  const url = request.nextUrl.clone();
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(nextPath)}`;
  return url;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticatedRequest(request);

  if (pathname.startsWith("/dashboard") && !authenticated) {
    return NextResponse.redirect(buildLoginRedirect(request));
  }

  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
