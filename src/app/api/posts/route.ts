import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_POSTS_BASE = "http://localhost:8080/api/v1/posts";

type PostStatus = "Draft" | "Pending Review" | "Scheduled" | "Published";
type PostType = "Job" | "Admit" | "Exam" | "Result";

type FrontendBody = Readonly<{
  readonly id?: string;
  readonly postTitle?: string;
  readonly postSlug?: string;
  readonly contentHtml?: string;
  readonly applicationId?: string;
  readonly department?: string;
  readonly organization?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly stateName?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly seoFocusKeyword?: string;
  readonly faqSchemaJson?: string;
  readonly postStatus?: PostStatus;
  readonly scheduledAt?: string;
  readonly postType?: PostType;
}>;

type BackendPostRecord = Readonly<{
  readonly id: string;
  readonly createdAt: string;
  readonly postTitle: string;
  readonly postSlug: string;
  readonly contentHtml: string;
  readonly applicationId: string;
  readonly department: string;
  readonly organization: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly stateName: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly seoFocusKeyword: string;
  readonly faqSchemaJson: string;
  readonly postStatus: PostStatus;
  readonly scheduledAt: string;
  readonly postType: PostType;
  readonly updatedAt: string;
}>;

type BackendApiResponse<T> = Readonly<{
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
}>;

type BackendPaged<T> = Readonly<{
  readonly content: ReadonlyArray<T>;
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly sort: string;
  readonly first: boolean;
  readonly last: boolean;
}>;

function toNonEmpty(input: unknown): string {
  return typeof input === "string" ? input.trim() : "";
}

function toPostStatus(input: unknown): PostStatus {
  if (
    input === "Draft" ||
    input === "Pending Review" ||
    input === "Scheduled" ||
    input === "Published"
  ) {
    return input;
  }

  return "Draft";
}

function toPostType(input: unknown): PostType {
  if (input === "Job" || input === "Admit" || input === "Exam" || input === "Result") {
    return input;
  }

  return "Job";
}

function normalizeRecord(record: Partial<BackendPostRecord>): BackendPostRecord {
  return {
    id: toNonEmpty(record.id),
    createdAt: toNonEmpty(record.createdAt),
    postTitle: toNonEmpty(record.postTitle),
    postSlug: toNonEmpty(record.postSlug),
    contentHtml: toNonEmpty(record.contentHtml),
    applicationId: toNonEmpty(record.applicationId),
    department: toNonEmpty(record.department),
    organization: toNonEmpty(record.organization),
    startDate: toNonEmpty(record.startDate),
    endDate: toNonEmpty(record.endDate),
    stateName: toNonEmpty(record.stateName),
    seoTitle: toNonEmpty(record.seoTitle),
    seoDescription: toNonEmpty(record.seoDescription),
    seoFocusKeyword: toNonEmpty(record.seoFocusKeyword),
    faqSchemaJson: toNonEmpty(record.faqSchemaJson),
    postStatus: toPostStatus(record.postStatus),
    scheduledAt: toNonEmpty(record.scheduledAt),
    postType: toPostType(record.postType),
    updatedAt: toNonEmpty(record.updatedAt),
  };
}

function mapFrontendToBackendPayload(body: FrontendBody) {
  return {
    postTitle: toNonEmpty(body.postTitle),
    postSlug: toNonEmpty(body.postSlug),
    contentHtml: toNonEmpty(body.contentHtml),
    applicationId: toNonEmpty(body.applicationId),
    department: toNonEmpty(body.department),
    organization: toNonEmpty(body.organization),
    startDate: toNonEmpty(body.startDate) || null,
    endDate: toNonEmpty(body.endDate) || null,
    stateName: toNonEmpty(body.stateName),
    seoTitle: toNonEmpty(body.seoTitle),
    seoDescription: toNonEmpty(body.seoDescription),
    seoFocusKeyword: toNonEmpty(body.seoFocusKeyword),
    faqSchemaJson: toNonEmpty(body.faqSchemaJson),
    postStatus: toPostStatus(body.postStatus),
    scheduledAt: toNonEmpty(body.scheduledAt) || null,
    postType: toPostType(body.postType),
  };
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function readRequestJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = toNonEmpty(searchParams.get("search"));
  const postType = toNonEmpty(searchParams.get("postType"));
  const page = toNonEmpty(searchParams.get("page")) || "0";
  const requestedSize = Number.parseInt(toNonEmpty(searchParams.get("size")) || "20", 10);
  const safeSize = Number.isFinite(requestedSize)
    ? Math.min(Math.max(requestedSize, 1), 100)
    : 20;
  const size = String(safeSize);

  const qs = new URLSearchParams({
    page,
    size,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  if (search) {
    qs.set("search", search);
  }

  if (postType) {
    qs.set("postType", postType);
  }

  const response = await fetch(`${BACKEND_POSTS_BASE}?${qs.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readJson<unknown>(response);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to fetch posts.") },
      { status: response.status },
    );
  }

  const payload = await readJson<BackendApiResponse<BackendPaged<Partial<BackendPostRecord>>>>(response);
  const records = payload?.data?.content?.map((item) => normalizeRecord(item)) ?? [];

  return NextResponse.json({ records });
}

export async function POST(request: Request) {
  const body = (await readRequestJson<FrontendBody>(request)) ?? {};

  const response = await fetch(BACKEND_POSTS_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapFrontendToBackendPayload(body)),
  });

  if (!response.ok) {
    const payload = await readJson<unknown>(response);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to create post.") },
      { status: response.status },
    );
  }

  const payload = await readJson<BackendApiResponse<Partial<BackendPostRecord>>>(response);
  const record = normalizeRecord(payload?.data ?? {});

  return NextResponse.json({ record }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await readRequestJson<FrontendBody>(request)) ?? {};
  const id = toNonEmpty(body.id);

  if (!id) {
    return NextResponse.json({ message: "id is required." }, { status: 400 });
  }

  const currentResponse = await fetch(`${BACKEND_POSTS_BASE}/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!currentResponse.ok) {
    const payload = await readJson<unknown>(currentResponse);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to fetch existing post for update.") },
      { status: currentResponse.status },
    );
  }

  const currentPayload = await readJson<BackendApiResponse<Partial<BackendPostRecord>>>(currentResponse);
  const current = normalizeRecord(currentPayload?.data ?? {});

  const mergedBody: FrontendBody = {
    postTitle: body.postTitle ?? current.postTitle,
    postSlug: body.postSlug ?? current.postSlug,
    contentHtml: body.contentHtml ?? current.contentHtml,
    applicationId: body.applicationId ?? current.applicationId,
    department: body.department ?? current.department,
    organization: body.organization ?? current.organization,
    startDate: body.startDate ?? current.startDate,
    endDate: body.endDate ?? current.endDate,
    stateName: body.stateName ?? current.stateName,
    seoTitle: body.seoTitle ?? current.seoTitle,
    seoDescription: body.seoDescription ?? current.seoDescription,
    seoFocusKeyword: body.seoFocusKeyword ?? current.seoFocusKeyword,
    faqSchemaJson: body.faqSchemaJson ?? current.faqSchemaJson,
    postStatus: body.postStatus ?? current.postStatus,
    scheduledAt: body.scheduledAt ?? current.scheduledAt,
    postType: body.postType ?? current.postType,
  };

  const response = await fetch(`${BACKEND_POSTS_BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapFrontendToBackendPayload(mergedBody)),
  });

  if (!response.ok) {
    const payload = await readJson<unknown>(response);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to update post.") },
      { status: response.status },
    );
  }

  const payload = await readJson<BackendApiResponse<Partial<BackendPostRecord>>>(response);
  const record = normalizeRecord(payload?.data ?? {});

  return NextResponse.json({ record });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = toNonEmpty(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ message: "id query parameter is required." }, { status: 400 });
  }

  const response = await fetch(`${BACKEND_POSTS_BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const payload = await readJson<unknown>(response);
    return NextResponse.json(
      { message: backendMessage(payload, "Failed to delete post.") },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true });
}
