import HomeJobsExplorer from "@/components/HomeJobsExplorer";
import HomeLeftSidebar from "@/components/HomeLeftSidebar";
import HomeRightSidebar from "@/components/HomeRightSidebar";
import type { LatestJob } from "@/data/sidebarContent";

const HOME_JOBS_PAYLOAD_LIMIT = 48;
const JOBS_API_URL = "http://localhost:8080/api/jobs?postType=Job&postStatus=Published&page=0&size=20";

type JobsApiContentItem = Readonly<{
  readonly applicationId?: string;
  readonly createdAt?: string;
  readonly department?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postStatus?: string;
  readonly postTitle?: string;
  readonly postType?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly stateName?: string;
  readonly vacancies?: number;
  readonly updatedAt?: string;
}>;

type JobsApiResponse = Readonly<{
  readonly data?: {
    readonly content?: JobsApiContentItem[];
  };
}>;

function toRelativeTime(value?: string): string {
  if (!value) return "Recently posted";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently posted";

  const diffMs = Date.now() - date.getTime();
  if (diffMs <= 0) return "Just now";

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function mapApiJobToExplorerJob(item: JobsApiContentItem): LatestJob {
  return {
    badge: item.organization || item.applicationId || "JOB",
    postName: item.postTitle || "Untitled Job",
    qualification: "Graduate",
    seats:
      typeof item.vacancies === "number" && Number.isFinite(item.vacancies)
        ? item.vacancies.toLocaleString("en-IN")
        : "N/A",
    state: item.stateName || "All India",
    startDate: item.startDate || "",
    lastDate: item.endDate || "",
    postedTime: toRelativeTime(item.createdAt),
    href: item.postSlug || "",
  };
}

async function fetchHomeJobs(): Promise<LatestJob[]> {
  try {
    const response = await fetch(JOBS_API_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as JobsApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapApiJobToExplorerJob);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const jobs = await fetchHomeJobs();
  const jobsForExplorer = jobs.slice(0, HOME_JOBS_PAYLOAD_LIMIT);

  return (
    <main className="w-full py-3 sm:py-4">
      <section className="grid w-full grid-cols-1 gap-2 px-0 md:grid-cols-[272px_minmax(0,1fr)] md:gap-3 md:px-0 lg:grid-cols-[272px_minmax(0,1fr)_272px] lg:gap-4">
        <HomeLeftSidebar />
        <HomeJobsExplorer jobs={jobsForExplorer} />
        <div className="md:col-span-2 lg:col-span-1">
          <HomeRightSidebar />
        </div>
      </section>
    </main>
  );
}
