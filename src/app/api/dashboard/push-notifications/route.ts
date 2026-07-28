import { NextRequest, NextResponse } from "next/server";

import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { isAuthenticatedRequest } from "@/lib/auth";

export const runtime = "nodejs";

type PushBody = Readonly<{
  readonly title?: string;
  readonly body?: string;
  readonly url?: string;
}>;

export async function POST(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dispatchSecret = process.env.PUSH_DISPATCH_SECRET;
  if (!dispatchSecret) {
    return NextResponse.json({ message: "Push dispatch is not configured." }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as PushBody | null;
  if (!payload?.title?.trim() || !payload.body?.trim() || !payload.url?.trim()) {
    return NextResponse.json({ message: "Notification title, body, and URL are required." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_PUBLIC_BASE_URL}/internal/push-notifications/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Push-Dispatch-Secret": dispatchSecret,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const responseBody = await response.text();
    return new NextResponse(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Push notification service is unavailable." }, { status: 502 });
  }
}
