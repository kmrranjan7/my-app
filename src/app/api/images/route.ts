import { NextResponse } from "next/server";

import { API_V1_IMAGES_BASE_URL } from "@/lib/apiConfig";

export const runtime = "nodejs";

const BACKEND_IMAGES_BASE = API_V1_IMAGES_BASE_URL;

type BackendApiResponse<T> = Readonly<{
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
}>;

type BackendPaged<T> = Readonly<{
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly sort: string;
  readonly first: boolean;
  readonly last: boolean;
}>;

type UploadPayload = Readonly<{
  readonly fileName: string;
  readonly url: string;
  readonly contentType: string;
  readonly size: number;
}>;

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function backendMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as { readonly message?: unknown }).message === "string"
  ) {
    return (payload as { readonly message: string }).message;
  }

  return fallback;
}

function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt((value ?? "").trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = toPositiveInt(searchParams.get("page"), 1);
  const size = Math.min(toPositiveInt(searchParams.get("size"), 20), 20);
  const modeRaw = (searchParams.get("mode") ?? "all").trim().toLowerCase();
  const mode = modeRaw === "matched" || modeRaw === "unmatched" ? modeRaw : "all";

  const response = await fetch(`${BACKEND_IMAGES_BASE}?page=${page}&size=${size}&mode=${mode}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readJson<unknown>(response);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to fetch images.") },
      { status: response.status },
    );
  }

  const payload = await readJson<BackendApiResponse<BackendPaged<string>>>(response);
  const data = payload?.data;

  return NextResponse.json({
    images: data?.content ?? [],
    page: data?.page ?? page,
    size: data?.size ?? size,
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
    hasMore: data ? !data.last : false,
  });
}

export async function POST(request: Request) {
  const incoming = await request.formData();
  const file = incoming.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Image file is required." }, { status: 400 });
  }

  const forward = new FormData();
  forward.append("file", file);

  const response = await fetch(BACKEND_IMAGES_BASE, {
    method: "POST",
    body: forward,
  });

  if (!response.ok) {
    const payload = await readJson<unknown>(response);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to upload image.") },
      { status: response.status },
    );
  }

  const payload = await readJson<BackendApiResponse<UploadPayload>>(response);
  return NextResponse.json({ upload: payload?.data ?? null }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageName = (searchParams.get("name") ?? "").trim();

  if (!imageName) {
    return NextResponse.json({ message: "name query parameter is required." }, { status: 400 });
  }

  const response = await fetch(`${BACKEND_IMAGES_BASE}/${encodeURIComponent(imageName)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const payload = await readJson<unknown>(response);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to delete image.") },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true });
}
