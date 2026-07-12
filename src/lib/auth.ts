import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "gov_portal_auth";
const AUTH_COOKIE_VALUE = "authenticated";

const DEFAULT_DEMO_EMAIL = "citizen@gov.in";
const DEFAULT_DEMO_PASSWORD = "GovPortal@2026";

export function getDemoCredentials() {
  return {
    email: process.env.DEMO_LOGIN_EMAIL ?? DEFAULT_DEMO_EMAIL,
    password: process.env.DEMO_LOGIN_PASSWORD ?? DEFAULT_DEMO_PASSWORD,
  };
}

export function isValidDemoLogin(email: string, password: string): boolean {
  const demo = getDemoCredentials();
  return email.toLowerCase() === demo.email.toLowerCase() && password === demo.password;
}

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
