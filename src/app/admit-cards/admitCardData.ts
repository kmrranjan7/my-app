import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { formatDate, getStatus } from "@/lib/dateStatus";

export const ADMIT_CARD_PAGE_SIZE = 20;
const PUBLIC_REVALIDATE_SECONDS = 60;

const ADMIT_CARDS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Admit&postStatus=Published&size=${ADMIT_CARD_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type ApiAdmitItem = Readonly<{
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
    readonly content?: ApiAdmitItem[];
  };
}>;

export type AdmitRow = Readonly<{
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

function mapToRow(item: ApiAdmitItem, index: number, page: number): AdmitRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Admit Card").trim();

  return {
    id: item.applicationId?.trim() || slug || `admit-${page}-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/admit-card",
    badge: item.organization?.trim() || item.applicationId?.trim() || "ADMIT",
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

export async function fetchAdmitCardsPage(page: number): Promise<AdmitRow[]> {
  try {
    const response = await fetch(`${ADMIT_CARDS_API_URL}&page=${page}`, {
      method: "GET",
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
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

export function getAdmitRowKey(item: AdmitRow): string {
  return `${item.href}|${item.title}|${item.startDate}|${item.lastDate}`;
}

export async function fetchAdmitCardsFirstPage(): Promise<AdmitRow[]> {
  return fetchAdmitCardsPage(0);
}
