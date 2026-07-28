import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { formatDate } from "@/lib/dateStatus";

export const EXAM_PAGE_SIZE = 20;
const PUBLIC_REVALIDATE_SECONDS = 60;
const EXAM_POSTS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Exam&postStatus=Published&size=${EXAM_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type ApiExamItem = Readonly<{
  readonly applicationId?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postTitle?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly stateName?: string;
}>;

type ApiExamResponse = Readonly<{
  readonly data?: { readonly content?: ApiExamItem[] };
}>;

export type ExamRow = Readonly<{
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly badge: string;
  readonly state: string;
  readonly startDate: string;
}>;

function mapToExamRow(item: ApiExamItem, index: number, page: number): ExamRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Exam Update").trim();

  return {
    id: item.applicationId?.trim() || slug || `exam-${page}-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/exam",
    badge: item.organization?.trim() || item.applicationId?.trim() || "EXAM",
    state: item.stateName?.trim() || "All India",
    startDate: formatDate(item.startDate),
  };
}

export async function fetchExamPage(page: number): Promise<ExamRow[]> {
  try {
    const response = await fetch(`${EXAM_POSTS_API_URL}&page=${page}`, {
      method: "GET",
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as ApiExamResponse;
    return (payload.data?.content ?? []).map((item, index) => mapToExamRow(item, index, page));
  } catch {
    return [];
  }
}

export function getExamRowKey(item: ExamRow): string {
  return `${item.href}|${item.title}|${item.startDate}`;
}

export async function fetchExamFirstPage(): Promise<ExamRow[]> {
  return fetchExamPage(0);
}
