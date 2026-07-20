import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "gov_portal_auth";
const AUTH_COOKIE_VALUE = "authenticated";

export function getAuthCookieConfig() {
  return {
    name: AUTH_COOKIE_NAME,
    value: AUTH_COOKIE_VALUE,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    },
  };
}

export function isAuthenticatedRequest(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return token === AUTH_COOKIE_VALUE;
}

export function isAuthenticatedCookieValue(value: string | undefined): boolean {
  return value === AUTH_COOKIE_VALUE;
}
