import { formatDate } from "@/lib/dateStatus";
import { fetchPublicJobs, type PublicJob } from "@/lib/publicJobs";

export const ADMISSION_PAGE_SIZE = 20;
export type AdmissionRow = Readonly<{ id: string; title: string; href: string; badge: string; state: string; seats: string; startDate: string; lastDate: string; daysLeft: string }>;

function daysRemaining(value?: string): string {
  if (!value) return "N/A";
  const endDate = new Date(value);
  if (Number.isNaN(endDate.getTime())) return "N/A";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const days = Math.ceil((endDate.getTime() - today.getTime()) / 86_400_000);
  return days < 0 ? "Expired" : days === 0 ? "Today" : `${days}d left`;
}

function mapRow(item: PublicJob, index: number, page: number): AdmissionRow {
  const slug = item.postSlug?.trim() || "";
  const lastDate = item.endDate || item.startDate;
  return {
    id: item.applicationId?.trim() || slug || `admission-${page}-${index + 1}`,
    title: item.postTitle?.trim() || "Untitled Admission Update",
    href: slug ? `/${slug}` : "/admission",
    badge: item.organization?.trim() || item.applicationId?.trim() || "ADMISSION",
    state: item.stateName?.trim() || "All India",
    seats: typeof item.vacancies === "number" && Number.isFinite(item.vacancies) ? item.vacancies.toLocaleString("en-IN") : "N/A",
    startDate: formatDate(item.startDate), lastDate: formatDate(lastDate), daysLeft: daysRemaining(lastDate),
  };
}

export async function fetchAdmissionPage(page: number): Promise<AdmissionRow[]> {
  return (await fetchPublicJobs("Admission", page, ADMISSION_PAGE_SIZE)).map((item, index) => mapRow(item, index, page));
}
export const getAdmissionRowKey = (item: AdmissionRow) => `${item.href}|${item.title}|${item.startDate}`;
export const fetchAdmissionFirstPage = () => fetchAdmissionPage(0);
