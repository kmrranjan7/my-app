import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { formatDate, getStatus } from "@/lib/dateStatus";

export const RESULTS_PAGE_SIZE = 20;

const RESULTS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Result&postStatus=Published&size=${RESULTS_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type ApiResultItem = Readonly<{
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
    readonly content?: ApiResultItem[];
  };
}>;

export type ResultRow = Readonly<{
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

function mapToRow(item: ApiResultItem, index: number, page: number): ResultRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Result").trim();

  return {
    id: item.applicationId?.trim() || slug || `result-${page}-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/result",
    badge: item.organization?.trim() || item.applicationId?.trim() || "RESULT",
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

export async function fetchResultsPage(page: number): Promise<ResultRow[]> {
  try {
    const response = await fetch(`${RESULTS_API_URL}&page=${page}`, {
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

export function getResultRowKey(item: ResultRow): string {
  return `${item.href}|${item.title}|${item.startDate}|${item.lastDate}`;
}

export async function fetchResultsFirstPage(): Promise<ResultRow[]> {
  return fetchResultsPage(0);
}
