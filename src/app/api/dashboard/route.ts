import { NextResponse } from "next/server";

import { API_V1_POSTS_BASE_URL } from "@/lib/apiConfig";
import type { DashboardPayload, NotificationItem, UserApplication } from "@/types/dashboard";

export const runtime = "nodejs";

const BACKEND_POSTS_BASE = API_V1_POSTS_BASE_URL;

type PostStatus = "Draft" | "Pending Review" | "Scheduled" | "Published";
type PostType = "Job" | "Admit" | "Exam" | "Result" | "Admission" | "Syllabus" | "Answer_Key";

type SavedPostRecord = Readonly<{
  readonly id: string;
  readonly createdAt: string;
  readonly postTitle: string;
  readonly applicationId: string;
  readonly department: string;
  readonly endDate: string;
  readonly stateName: string;
  readonly postStatus: PostStatus;
  readonly postType: PostType;
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
  if (
    input === "Job" ||
    input === "Admit" ||
    input === "Exam" ||
    input === "Result" ||
    input === "Admission" ||
    input === "Syllabus" ||
    input === "Answer_Key"
  ) {
    return input;
  }

  return "Job";
}

function toRecord(item: Partial<SavedPostRecord>): SavedPostRecord {
  return {
    id: toNonEmpty(item.id),
    createdAt: toNonEmpty(item.createdAt),
    postTitle: toNonEmpty(item.postTitle),
    applicationId: toNonEmpty(item.applicationId),
    department: toNonEmpty(item.department),
    endDate: toNonEmpty(item.endDate),
    stateName: toNonEmpty(item.stateName),
    postStatus: toPostStatus(item.postStatus),
    postType: toPostType(item.postType),
  };
}

function mapPostStatusToApplicationStatus(status: PostStatus): string {
  if (status === "Published") {
    return "Result Published";
  }

  if (status === "Pending Review") {
    return "Under Review";
  }

  if (status === "Scheduled") {
    return "Exam Scheduled";
  }

  return "Applied";
}

function buildApplications(records: ReadonlyArray<SavedPostRecord>): ReadonlyArray<UserApplication> {
  return records.slice(0, 120).map((record) => ({
    id: record.applicationId || `APP-${record.id}`,
    jobId: record.id,
    jobName: record.postTitle || "Untitled Post",
    department: record.department || "General",
    appliedDate: record.createdAt.slice(0, 10),
    status: mapPostStatusToApplicationStatus(record.postStatus),
  }));
}

function buildNotifications(records: ReadonlyArray<SavedPostRecord>): ReadonlyArray<NotificationItem> {
  const now = Date.now();

  return records.slice(0, 6).map((record, index) => {
    const createdTs = Date.parse(record.createdAt);
    const ageDays = Number.isNaN(createdTs)
      ? 999
      : Math.floor((now - createdTs) / (1000 * 60 * 60 * 24));

    let kind: NotificationItem["kind"] = "Recruitment";
    if (record.postType === "Exam" || record.postType === "Syllabus" || record.postType === "Answer_Key") {
      kind = "Exam";
    } else if (record.postType === "Result") {
      kind = "Result";
    }

    return {
      id: `N-POST-${index + 1}`,
      title: `${record.postType} Update`,
      message: record.postTitle || "New post update available.",
      date: record.createdAt.slice(0, 10),
      kind,
      isNew: ageDays <= 7,
    };
  });
}

function buildMonthBuckets(records: ReadonlyArray<SavedPostRecord>) {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const windowSize = 7;

  const months = Array.from({ length: windowSize }).map((_, index) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (windowSize - index - 1), 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: labels[d.getMonth()],
      total: 0,
      published: 0,
      pending: 0,
    };
  });

  const lookup = new Map(months.map((item) => [`${item.year}-${item.month}`, item]));

  records.forEach((record) => {
    const created = new Date(record.createdAt);
    if (Number.isNaN(created.getTime())) {
      return;
    }

    const bucket = lookup.get(`${created.getFullYear()}-${created.getMonth()}`);
    if (!bucket) {
      return;
    }

    bucket.total += 1;

    if (record.postStatus === "Published") {
      bucket.published += 1;
    }

    if (record.postStatus !== "Published") {
      bucket.pending += 1;
    }
  });

  return months;
}

async function fetchBackendPosts(): Promise<ReadonlyArray<SavedPostRecord>> {
  const pageSize = 100;
  let page = 0;
  const collected: SavedPostRecord[] = [];

  while (true) {
    const query = new URLSearchParams({
      page: String(page),
      size: String(pageSize),
      sortBy: "createdAt",
      sortDir: "desc",
    });

    const response = await fetch(`${BACKEND_POSTS_BASE}?${query.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts from backend service.");
    }

    const payload = (await response.json()) as BackendApiResponse<BackendPaged<Partial<SavedPostRecord>>>;
    const pageData = payload.data;
    collected.push(...(pageData.content ?? []).map((item) => toRecord(item)));

    if (pageData.last || page + 1 >= pageData.totalPages) {
      break;
    }

    page += 1;
  }

  return collected;
}

export async function GET() {
  try {
    const records = await fetchBackendPosts();
    const applications = buildApplications(records);
    const monthBuckets = buildMonthBuckets(records);

    const postTypeBuckets = records.reduce(
      (acc, item) => {
        acc[item.postType] += 1;
        return acc;
      },
      { Job: 0, Admit: 0, Exam: 0, Result: 0, Admission: 0, Syllabus: 0, Answer_Key: 0 } satisfies Record<PostType, number>,
    );

    const statusBuckets = records.reduce(
      (acc, item) => {
        acc[item.postStatus] += 1;
        return acc;
      },
      {
        Draft: 0,
        "Pending Review": 0,
        Scheduled: 0,
        Published: 0,
      } satisfies Record<PostStatus, number>,
    );

    const notifications: ReadonlyArray<NotificationItem> = (() => {
      const built = buildNotifications(records);
      if (built.length > 0) {
        return built;
      }

      return [
        {
          id: "N-DB-1",
          title: "No records found",
          message: "Create your first post to see dashboard insights.",
          date: new Date().toISOString().slice(0, 10),
          kind: "Recruitment",
          isNew: true,
        },
      ];
    })();

    const payload: DashboardPayload = {
      stats: [
        {
          id: "job",
          label: "Total Job",
          value: postTypeBuckets.Job,
          changeText: `${postTypeBuckets.Job} recruitment posts`,
        },
        {
          id: "admit",
          label: "Admit Card",
          value: postTypeBuckets.Admit + postTypeBuckets.Admission,
          changeText: `${postTypeBuckets.Admit + postTypeBuckets.Admission} admit updates`,
        },
        {
          id: "exam",
          label: "Exam",
          value: postTypeBuckets.Exam + postTypeBuckets.Syllabus + postTypeBuckets.Answer_Key,
          changeText: `${postTypeBuckets.Exam + postTypeBuckets.Syllabus + postTypeBuckets.Answer_Key} exam posts`,
        },
        {
          id: "results",
          label: "Result",
          value: postTypeBuckets.Result,
          changeText: `${postTypeBuckets.Result} result posts`,
        },
      ],
      jobs: records.slice(0, 12).map((item, index) => ({
        id: `JOB-${index + 1}`,
        department: item.department || "General",
        title: item.postTitle || "Untitled Post",
        location: item.stateName || "India",
        lastDate: item.endDate || item.createdAt.slice(0, 10),
        status: item.postStatus === "Published" ? "Closed" : "Open",
        category: item.postType,
      })),
      applications,
      categories: [
        { id: "CAT-JOB", name: "Recruitment", openPositions: postTypeBuckets.Job },
        { id: "CAT-ADM", name: "Admit", openPositions: postTypeBuckets.Admit + postTypeBuckets.Admission },
        { id: "CAT-EXM", name: "Exam", openPositions: postTypeBuckets.Exam + postTypeBuckets.Syllabus + postTypeBuckets.Answer_Key },
        { id: "CAT-RSL", name: "Result", openPositions: postTypeBuckets.Result },
      ],
      notifications,
      categoryChart: [
        { category: "Recruitment", applications: postTypeBuckets.Job },
        { category: "Admit", applications: postTypeBuckets.Admit + postTypeBuckets.Admission },
        { category: "Exam", applications: postTypeBuckets.Exam + postTypeBuckets.Syllabus + postTypeBuckets.Answer_Key },
        { category: "Result", applications: postTypeBuckets.Result },
      ],
      statusChart: [
        { status: "Applied", value: statusBuckets.Draft },
        { status: "Under Review", value: statusBuckets["Pending Review"] },
        { status: "Exam Scheduled", value: statusBuckets.Scheduled },
        { status: "Result Published", value: statusBuckets.Published },
      ],
      recruitmentChart: monthBuckets.map((item) => ({
        month: item.label,
        vacancies: item.pending,
        applications: item.total,
        results: item.published,
      })),
      monthlyTrend: monthBuckets.map((item) => ({
        month: item.label,
        jobs: item.total,
      })),
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch dashboard data from backend service." },
      { status: 502 },
    );
  }
}
