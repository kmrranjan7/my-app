import { formatDate } from "@/lib/dateStatus";
import { fetchPublicJobs, type PublicJob } from "@/lib/publicJobs";

export const SYLLABUS_PAGE_SIZE = 20;
export type SyllabusRow = Readonly<{ id: string; title: string; href: string; badge: string; state: string; startDate: string }>;

function mapRow(item: PublicJob, index: number, page: number): SyllabusRow {
  const slug = item.postSlug?.trim() || "";
  return {
    id: item.applicationId?.trim() || slug || `syllabus-${page}-${index + 1}`,
    title: item.postTitle?.trim() || "Untitled Syllabus Update",
    href: slug ? `/${slug}` : "/syllabus",
    badge: item.organization?.trim() || item.applicationId?.trim() || "SYLLABUS",
    state: item.stateName?.trim() || "All India",
    startDate: formatDate(item.startDate),
  };
}

export async function fetchSyllabusPage(page: number): Promise<SyllabusRow[]> {
  return (await fetchPublicJobs("Syllabus", page, SYLLABUS_PAGE_SIZE)).map((item, index) => mapRow(item, index, page));
}
export const getSyllabusRowKey = (item: SyllabusRow) => `${item.href}|${item.title}|${item.startDate}`;
export const fetchSyllabusFirstPage = () => fetchSyllabusPage(0);
