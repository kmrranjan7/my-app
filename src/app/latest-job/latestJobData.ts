import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { formatDate, getStatus } from "@/lib/dateStatus";

export const LATEST_JOB_PAGE_SIZE = 20;

const LATEST_JOBS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Job&postStatus=Published&size=${LATEST_JOB_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type ApiJobItem = Readonly<{
  readonly applicationId?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postTitle?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly stateName?: string;
  readonly vacancies?: number;
}>;

type ApiResponse = Readonly<{
  readonly data?: {
    readonly content?: ApiJobItem[];
  };
}>;

export type LatestJobRow = Readonly<{
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly badge: string;
  readonly state: string;
  readonly seats: string;
  readonly startDate: string;
  readonly lastDate: string;
  readonly status: string;
}>;

function mapToRow(item: ApiJobItem, index: number, page: number): LatestJobRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Job").trim();

  return {
    id: item.applicationId?.trim() || slug || `row-${page}-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/latest-job",
    badge: item.organization?.trim() || item.applicationId?.trim() || "JOB",
    state: item.stateName?.trim() || "All India",
    seats:
      typeof item.vacancies === "number" && Number.isFinite(item.vacancies)
        ? item.vacancies.toLocaleString("en-IN")
        : "N/A",
    startDate: formatDate(item.startDate),
    lastDate: formatDate(item.endDate),
    status: getStatus(item.startDate, item.endDate),
  };
}

export async function fetchLatestJobsPage(page: number): Promise<LatestJobRow[]> {
  try {
    const response = await fetch(`${LATEST_JOBS_API_URL}&page=${page}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiResponse;
    const content = payload.data?.content ?? [];
    return content.map((item, index) => mapToRow(item, index, page));
  } catch {
    return [];
  }
}

export function getLatestJobRowKey(item: LatestJobRow): string {
  return `${item.href}|${item.title}|${item.startDate}|${item.lastDate}`;
}

export async function fetchLatestJobsFirstPage(): Promise<LatestJobRow[]> {
  return fetchLatestJobsPage(0);
}
