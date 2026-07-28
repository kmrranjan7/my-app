import { formatDate, parseDateSafe, toDateOnly } from "@/lib/dateStatus";
import { fetchPublicJobs, type PublicJob } from "@/lib/publicJobs";

export const ADMISSION_PAGE_SIZE = 20;
export type AdmissionRow = Readonly<{ id: string; title: string; href: string; badge: string; state: string; seats: string; startDate: string; lastDate: string; duration: string }>;

function applicationDuration(startDateValue?: string, endDateValue?: string): string {
  const startDate = parseDateSafe(startDateValue);
  const endDate = parseDateSafe(endDateValue);
  if (!startDate || !endDate) return "To Be Announced";

  const days = Math.ceil((toDateOnly(endDate).getTime() - toDateOnly(startDate).getTime()) / 86_400_000);
  return days < 0 ? "Invalid dates" : `${days}d left`;
}

function mapRow(item: PublicJob, index: number, page: number): AdmissionRow {
  const slug = item.postSlug?.trim() || "";
  const lastDate = item.endDate;
  return {
    id: item.applicationId?.trim() || slug || `admission-${page}-${index + 1}`,
    title: item.postTitle?.trim() || "Untitled Admission Update",
    href: slug ? `/${slug}` : "/admission",
    badge: item.organization?.trim() || item.applicationId?.trim() || "ADMISSION",
    state: item.stateName?.trim() || "All India",
    seats: typeof item.vacancies === "number" && Number.isFinite(item.vacancies) ? item.vacancies.toLocaleString("en-IN") : "N/A",
    startDate: formatDate(item.startDate), lastDate: formatDate(lastDate), duration: applicationDuration(item.startDate, lastDate),
  };
}

export async function fetchAdmissionPage(page: number): Promise<AdmissionRow[]> {
  return (await fetchPublicJobs("Admission", page, ADMISSION_PAGE_SIZE)).map((item, index) => mapRow(item, index, page));
}
export const getAdmissionRowKey = (item: AdmissionRow) => `${item.href}|${item.title}|${item.startDate}`;
export const fetchAdmissionFirstPage = () => fetchAdmissionPage(0);
