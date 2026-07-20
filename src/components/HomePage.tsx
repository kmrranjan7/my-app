import Link from "next/link";
import HomeJobsExplorer from "@/components/HomeJobsExplorer";
import HomeLeftSidebar from "@/components/HomeLeftSidebar";
import HomeRightSidebar from "@/components/HomeRightSidebar";
import type { LatestJob, LatestUpdate, RightSideItem, UpcomingExam } from "@/data/sidebarContent";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";

const HOME_JOBS_PAYLOAD_LIMIT = 48;
const SIDEBAR_PAGE_SIZE = 10;
const PUBLIC_FEED_REVALIDATE_SECONDS = 60;
const JOBS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Job&postStatus=Published&page=0&size=20`;
const LATEST_UPDATES_API_URL =
  `${API_PUBLIC_BASE_URL}/latest-update?postStatus=Published&page=0&size=${SIDEBAR_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
const EXAMS_API_URL =
  `${API_PUBLIC_BASE_URL}/jobs?postType=Exam&postStatus=Published&page=0&size=${SIDEBAR_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
const ADMIT_CARDS_API_URL =
  `${API_PUBLIC_BASE_URL}/jobs?postType=Admit&postStatus=Published&page=0&size=${SIDEBAR_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
const RESULTS_API_URL =
  `${API_PUBLIC_BASE_URL}/jobs?postType=Result&postStatus=Published&page=0&size=${SIDEBAR_PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type JobsApiContentItem = Readonly<{
  readonly applicationId?: string;
  readonly createdAt?: string;
  readonly department?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postStatus?: string;
  readonly postTitle?: string;
  readonly postType?: string;
  readonly isFeatured?: boolean;
  readonly priorityScore?: number;
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

type SidebarApiResponse = Readonly<{
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
    isFeatured: item.isFeatured === true,
    priorityScore:
      typeof item.priorityScore === "number" && Number.isFinite(item.priorityScore)
        ? item.priorityScore
        : 0,
    createdAt: item.createdAt,
  };
}

function mapApiLatestUpdate(item: JobsApiContentItem): LatestUpdate {
  return {
    title: item.postTitle || "Untitled Update",
    time: toRelativeTime(item.createdAt),
    type: item.postType || "Update",
    href: item.postSlug ? `/${item.postSlug}` : "/updates",
  };
}

function formatExamDate(value?: string): string {
  if (!value) return "Date TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBA";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapApiUpcomingExam(item: JobsApiContentItem): UpcomingExam {
  const examDate = item.startDate || item.endDate || item.createdAt;

  return {
    title: item.postTitle || "Untitled Exam",
    date: formatExamDate(examDate),
    category: "Exam",
    badge: item.organization || "Exam",
    href: item.postSlug ? `/${item.postSlug}` : "/exams",
  };
}

function mapApiAdmitCard(item: JobsApiContentItem): RightSideItem {
  return {
    title: item.postTitle || "Untitled Admit Card",
    time: toRelativeTime(item.createdAt),
    category: "Admit Card",
    badge: item.organization || "Admit",
    href: item.postSlug ? `/${item.postSlug}` : "/admit-card",
  };
}

function mapApiResult(item: JobsApiContentItem): RightSideItem {
  return {
    title: item.postTitle || "Untitled Result",
    time: toRelativeTime(item.createdAt),
    category: "Result",
    badge: item.organization || "Result",
    href: item.postSlug ? `/results/${item.postSlug}` : "/results",
  };
}

async function fetchHomeJobs(): Promise<LatestJob[]> {
  try {
    const response = await fetch(JOBS_API_URL, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
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

async function fetchLatestUpdatesFirstPage(): Promise<LatestUpdate[]> {
  try {
    const response = await fetch(LATEST_UPDATES_API_URL, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as SidebarApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapApiLatestUpdate);
  } catch {
    return [];
  }
}

async function fetchUpcomingExamsFirstPage(): Promise<UpcomingExam[]> {
  try {
    const response = await fetch(EXAMS_API_URL, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as SidebarApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapApiUpcomingExam);
  } catch {
    return [];
  }
}

async function fetchAdmitCardsFirstPage(): Promise<RightSideItem[]> {
  try {
    const response = await fetch(ADMIT_CARDS_API_URL, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as SidebarApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapApiAdmitCard);
  } catch {
    return [];
  }
}

async function fetchResultsFirstPage(): Promise<RightSideItem[]> {
  try {
    const response = await fetch(RESULTS_API_URL, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as SidebarApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapApiResult);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [jobs, initialUpdates, initialExams, initialAdmitCards, initialResults] = await Promise.all([
    fetchHomeJobs(),
    fetchLatestUpdatesFirstPage(),
    fetchUpcomingExamsFirstPage(),
    fetchAdmitCardsFirstPage(),
    fetchResultsFirstPage(),
  ]);
  const jobsForExplorer = jobs.slice(0, HOME_JOBS_PAYLOAD_LIMIT);

  return (
    <main className="w-full min-w-0 overflow-x-hidden py-3 sm:py-4">
      <section className="grid w-full min-w-0 grid-cols-1 gap-2 px-0 [&>*]:min-w-0 lg:grid-cols-[272px_minmax(0,1fr)_272px] lg:gap-4">
        <div className="hidden lg:block">
          <HomeLeftSidebar initialUpdates={initialUpdates} initialExams={initialExams} />
        </div>

        <HomeJobsExplorer jobs={jobsForExplorer} />

        <div className="hidden lg:block">
          <HomeRightSidebar initialAdmitCards={initialAdmitCards} initialResults={initialResults} />
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
