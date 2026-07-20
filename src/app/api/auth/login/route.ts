import { NextResponse } from "next/server";

import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { getAuthCookieConfig } from "@/lib/auth";

type LoginBody = {
  readonly username?: string;
  readonly password?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${API_PUBLIC_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Authentication service is unavailable." },
      { status: 503 },
    );
  }

  if (!backendResponse.ok) {
    const backendPayload = (await backendResponse.json().catch(() => null)) as {
      message?: string;
    } | null;

    return NextResponse.json(
      { message: backendPayload?.message ?? "Invalid credentials. Please try again." },
      { status: backendResponse.status },
    );
  }

  const response = NextResponse.json({ success: true });
  const cookie = getAuthCookieConfig();
  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
