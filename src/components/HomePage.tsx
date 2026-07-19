import Link from "next/link";
import HomeJobsExplorer from "@/components/HomeJobsExplorer";
import HomeLeftSidebar from "@/components/HomeLeftSidebar";
import HomeRightSidebar from "@/components/HomeRightSidebar";
import type { LatestJob } from "@/data/sidebarContent";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";

const HOME_JOBS_PAYLOAD_LIMIT = 48;
const JOBS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Job&postStatus=Published&page=0&size=20`;

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
    <main className="w-full min-w-0 overflow-x-hidden py-3 sm:py-4">
      <section className="grid w-full min-w-0 grid-cols-1 gap-2 px-0 [&>*]:min-w-0 lg:grid-cols-[272px_minmax(0,1fr)_272px] lg:gap-4">
        <div className="hidden lg:block">
          <HomeLeftSidebar />
        </div>

        <HomeJobsExplorer jobs={jobsForExplorer} />

        <div className="hidden lg:block">
          <HomeRightSidebar />
        </div>
      </section>

      <section className="mx-auto mt-4 w-[min(1220px,96vw)] rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.12em] text-blue-800">
          Explore Top Sarkari Sections
        </h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Jump directly to high-priority updates for latest government recruitment,
          exam results, and admit card releases.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Link
            href="/latest-job"
            className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-[13px] font-bold leading-5 text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800"
          >
            Latest Govt Jobs 2026 Notifications and Apply Online Updates
          </Link>
          <Link
            href="/result"
            className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-[13px] font-bold leading-5 text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800"
          >
            Latest Sarkari Result, Merit List, and Selection List Announcements
          </Link>
          <Link
            href="/admit-card"
            className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-[13px] font-bold leading-5 text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800"
          >
            Download Admit Card and Government Exam Hall Ticket Updates
          </Link>
        </div>
      </section>
    </main>
  );
}
