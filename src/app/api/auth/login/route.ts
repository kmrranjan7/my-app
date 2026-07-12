import { NextResponse } from "next/server";

import { getAuthCookieConfig, isValidDemoLogin } from "@/lib/auth";

type LoginBody = {
  readonly email?: string;
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

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  if (!isValidDemoLogin(email, password)) {
    return NextResponse.json(
      { message: "Invalid credentials. Please try again." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  const cookie = getAuthCookieConfig();
  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
