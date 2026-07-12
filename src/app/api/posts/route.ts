import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PostStatus = "Draft" | "Pending Review" | "Scheduled" | "Published";
type PostType = "Job" | "Admit" | "Exam" | "Result";

type CreatePostBody = Readonly<{
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

type SavedPostRecord = Readonly<{
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
}>;

type UpdatePostBody = Readonly<{
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
  if (input === "Admit" || input === "Exam" || input === "Result" || input === "Job") {
    return input;
  }

  return "Job";
}

function toNonEmpty(input: unknown): string {
  return typeof input === "string" ? input.trim() : "";
}

function buildPostId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const suffix = Math.floor(Math.random() * 90000 + 10000);
  return `POST-${year}-${suffix}`;
}

const dataDir = path.join(process.cwd(), "data");
const recordsPath = path.join(dataDir, "saved-posts.json");

async function readRecords(): Promise<SavedPostRecord[]> {
  try {
    const raw = await readFile(recordsPath, "utf8");
    const parsed = JSON.parse(raw) as Array<Partial<SavedPostRecord>>;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
      id: toNonEmpty(item.id),
      createdAt: toNonEmpty(item.createdAt),
      postTitle: toNonEmpty(item.postTitle),
      postSlug: toNonEmpty(item.postSlug),
      contentHtml: toNonEmpty(item.contentHtml),
      applicationId: toNonEmpty(item.applicationId),
      department: toNonEmpty(item.department),
      organization: toNonEmpty(item.organization),
      startDate: toNonEmpty(item.startDate),
      endDate: toNonEmpty(item.endDate),
      stateName: toNonEmpty(item.stateName),
      seoTitle: toNonEmpty(item.seoTitle),
      seoDescription: toNonEmpty(item.seoDescription),
      seoFocusKeyword: toNonEmpty(item.seoFocusKeyword),
      faqSchemaJson: typeof item.faqSchemaJson === "string" ? item.faqSchemaJson : "",
      postStatus: toPostStatus(item.postStatus),
      scheduledAt: toNonEmpty(item.scheduledAt),
      postType: toPostType(item.postType),
    }));
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  let body: CreatePostBody;

  try {
    body = (await request.json()) as CreatePostBody;
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const postTitle = toNonEmpty(body.postTitle);
  const postSlug = toNonEmpty(body.postSlug);
  const contentHtml = toNonEmpty(body.contentHtml);
  const applicationId = toNonEmpty(body.applicationId) || buildPostId().replace("POST", "APP");
  const department = toNonEmpty(body.department);
  const organization = toNonEmpty(body.organization);
  const startDate = toNonEmpty(body.startDate);
  const endDate = toNonEmpty(body.endDate);
  const stateName = toNonEmpty(body.stateName);
  const seoTitle = toNonEmpty(body.seoTitle);
  const seoDescription = toNonEmpty(body.seoDescription);
  const seoFocusKeyword = toNonEmpty(body.seoFocusKeyword);
  const faqSchemaJson = typeof body.faqSchemaJson === "string" ? body.faqSchemaJson : "";
  const postStatus = toPostStatus(body.postStatus);
  const scheduledAt = toNonEmpty(body.scheduledAt);
  const postType = toPostType(body.postType);

  if (!postTitle || !postSlug || !contentHtml) {
    return NextResponse.json(
      { message: "postTitle, postSlug and contentHtml are required." },
      { status: 400 },
    );
  }

  const nextRecord: SavedPostRecord = {
    id: buildPostId(),
    createdAt: new Date().toISOString(),
    postTitle,
    postSlug,
    contentHtml,
    applicationId,
    department,
    organization,
    startDate,
    endDate,
    stateName,
    seoTitle,
    seoDescription,
    seoFocusKeyword,
    faqSchemaJson,
    postStatus,
    scheduledAt,
    postType,
  };

  const records = await readRecords();
  const nextRecords = [nextRecord, ...records];

  await mkdir(dataDir, { recursive: true });
  await writeFile(recordsPath, JSON.stringify(nextRecords, null, 2), "utf8");

  return NextResponse.json({ record: nextRecord }, { status: 201 });
}

export async function GET() {
  const records = await readRecords();
  return NextResponse.json({ records });
}

export async function PATCH(request: Request) {
  let body: UpdatePostBody;

  try {
    body = (await request.json()) as UpdatePostBody;
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const id = toNonEmpty(body.id);
  if (!id) {
    return NextResponse.json({ message: "id is required." }, { status: 400 });
  }

  const records = await readRecords();
  const index = records.findIndex((item) => item.id === id);

  if (index < 0) {
    return NextResponse.json({ message: "Record not found." }, { status: 404 });
  }

  const current = records[index];
  const updated: SavedPostRecord = {
    ...current,
    postTitle: toNonEmpty(body.postTitle) || current.postTitle,
    postSlug: toNonEmpty(body.postSlug) || current.postSlug,
    contentHtml: toNonEmpty(body.contentHtml) || current.contentHtml,
    applicationId: toNonEmpty(body.applicationId) || current.applicationId,
    department: toNonEmpty(body.department) || current.department,
    organization: toNonEmpty(body.organization) || current.organization,
    startDate: toNonEmpty(body.startDate) || current.startDate,
    endDate: toNonEmpty(body.endDate) || current.endDate,
    stateName: toNonEmpty(body.stateName) || current.stateName,
    seoTitle: toNonEmpty(body.seoTitle) || current.seoTitle,
    seoDescription: toNonEmpty(body.seoDescription) || current.seoDescription,
    seoFocusKeyword: toNonEmpty(body.seoFocusKeyword) || current.seoFocusKeyword,
    faqSchemaJson:
      typeof body.faqSchemaJson === "string" ? body.faqSchemaJson : current.faqSchemaJson,
    postStatus:
      typeof body.postStatus === "string" ? toPostStatus(body.postStatus) : current.postStatus,
    scheduledAt:
      typeof body.scheduledAt === "string" ? toNonEmpty(body.scheduledAt) : current.scheduledAt,
    postType: typeof body.postType === "string" ? toPostType(body.postType) : current.postType,
  };

  const nextRecords = records.map((item) => (item.id === id ? updated : item));
  await mkdir(dataDir, { recursive: true });
  await writeFile(recordsPath, JSON.stringify(nextRecords, null, 2), "utf8");

  return NextResponse.json({ record: updated });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = toNonEmpty(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ message: "id query parameter is required." }, { status: 400 });
  }

  const records = await readRecords();
  const nextRecords = records.filter((item) => item.id !== id);

  if (nextRecords.length === records.length) {
    return NextResponse.json({ message: "Record not found." }, { status: 404 });
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(recordsPath, JSON.stringify(nextRecords, null, 2), "utf8");

  return NextResponse.json({ success: true });
}
