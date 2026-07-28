import { formatDate } from "@/lib/dateStatus";
import { fetchPublicJobs, type PublicJob } from "@/lib/publicJobs";

export const ANSWER_KEY_PAGE_SIZE = 20;
export type AnswerKeyRow = Readonly<{ id: string; title: string; href: string; badge: string; state: string; startDate: string }>;

function mapRow(item: PublicJob, index: number, page: number): AnswerKeyRow {
  const slug = item.postSlug?.trim() || "";
  return {
    id: item.applicationId?.trim() || slug || `answer-key-${page}-${index + 1}`,
    title: item.postTitle?.trim() || "Untitled Answer Key Update",
    href: slug ? `/${slug}` : "/answer-key",
    badge: item.organization?.trim() || item.applicationId?.trim() || "ANSWER_KEY",
    state: item.stateName?.trim() || "All India",
    startDate: formatDate(item.startDate),
  };
}

export async function fetchAnswerKeyPage(page: number): Promise<AnswerKeyRow[]> {
  return (await fetchPublicJobs("Answer_Key", page, ANSWER_KEY_PAGE_SIZE)).map((item, index) => mapRow(item, index, page));
}
export const getAnswerKeyRowKey = (item: AnswerKeyRow) => `${item.href}|${item.title}|${item.startDate}`;
export const fetchAnswerKeyFirstPage = () => fetchAnswerKeyPage(0);
