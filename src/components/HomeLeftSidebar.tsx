"use client";

import Link from "next/link";
import { useCallback } from "react";
import { type LatestUpdate, type UpcomingExam } from "@/data/sidebarContent";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";

const PAGE_SIZE = 10;
const LATEST_UPDATES_API_URL =
  `${API_PUBLIC_BASE_URL}/latest-update?postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
const EXAMS_API_URL =
  `${API_PUBLIC_BASE_URL}/jobs?postType=Exam&postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type PublicJobsApiItem = Readonly<{
  readonly createdAt?: string;
  readonly endDate?: string;
  readonly postType?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postTitle?: string;
  readonly startDate?: string;
}>;

type PublicJobsApiResponse = Readonly<{
  readonly data?: {
    readonly content?: PublicJobsApiItem[];
  };
}>;

const dynamicBadgePalettes = [
  "border-blue-200 bg-blue-50 text-blue-700",
  "border-rose-200 bg-rose-50 text-rose-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-amber-200 bg-amber-50 text-amber-700",
  "border-violet-200 bg-violet-50 text-violet-700",
  "border-cyan-200 bg-cyan-50 text-cyan-700",
  "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  "border-lime-200 bg-lime-50 text-lime-700",
];

function getTypeStyles(type: string) {
  if (!type.trim()) {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  const colorIndex = getTextHash(type.toLowerCase()) % dynamicBadgePalettes.length;
  return dynamicBadgePalettes[colorIndex];
}

function getTextHash(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    const codePoint = value.codePointAt(i) ?? 0;
    hash = Math.trunc((hash * 31 + codePoint) % 2147483647);
  }

  return Math.abs(hash);
}

function getExamBadgeStyles(badge: string) {
  if (!badge.trim()) {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  const colorIndex = getTextHash(badge.toLowerCase()) % dynamicBadgePalettes.length;
  return dynamicBadgePalettes[colorIndex];
}

function toRelativeTime(value?: string): string {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  if (diffMs <= 0) return "Just now";

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function mapLatestUpdateApiItem(item: PublicJobsApiItem): LatestUpdate {
  const slug = item.postSlug?.trim();

  return {
    title: item.postTitle?.trim() || "Untitled Update",
    time: toRelativeTime(item.createdAt),
    type: item.postType?.trim() || "Update",
    href: slug ? `/${slug}` : "/updates",
  };
}

async function fetchLatestUpdatesPage(page: number): Promise<LatestUpdate[]> {
  try {
    const response = await fetch(`${LATEST_UPDATES_API_URL}&page=${page}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as PublicJobsApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapLatestUpdateApiItem);
  } catch {
    return [];
  }
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

function mapExamApiItem(item: PublicJobsApiItem): UpcomingExam {
  const slug = item.postSlug?.trim();
  const examDate = item.startDate || item.endDate || item.createdAt;

  return {
    title: item.postTitle?.trim() || "Untitled Exam",
    date: formatExamDate(examDate),
    category: "Exam",
    badge: item.organization?.trim() || "Exam",
    href: slug ? `/${slug}` : "/exams",
  };
}

async function fetchUpcomingExamsPage(page: number): Promise<UpcomingExam[]> {
  try {
    const response = await fetch(`${EXAMS_API_URL}&page=${page}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as PublicJobsApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapExamApiItem);
  } catch {
    return [];
  }
}

function BellIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

function UpdateTypeIcon({ type, className }: Readonly<{ type: string; className?: string }>) {
  const normalized = type.toLowerCase();

  if (normalized.includes("admit")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v3a2 2 0 0 0 0 3v3a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-3a2 2 0 0 0 0-3z" />
        <path d="M9 10h6" />
        <path d="M9 14h4" />
      </svg>
    );
  }

  if (normalized.includes("answer")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M8 12h8" />
        <path d="M8 16h5" />
        <path d="M6.5 4h8l3 3v13H6.5A1.5 1.5 0 0 1 5 18.5v-13A1.5 1.5 0 0 1 6.5 4Z" />
      </svg>
    );
  }

  if (normalized.includes("result")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M5 20h14" />
        <path d="M7.5 16V9" />
        <path d="M12 16V6" />
        <path d="M16.5 16v-4" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2v20" />
      <path d="M4 7h8" />
      <path d="M4 11h9" />
      <path d="M4 15h8" />
    </svg>
  );
}

type HomeLeftSidebarProps = Readonly<{
  initialUpdates?: readonly LatestUpdate[];
  initialExams?: readonly UpcomingExam[];
}>;

const EMPTY_INITIAL_UPDATES: readonly LatestUpdate[] = [];
const EMPTY_INITIAL_EXAMS: readonly UpcomingExam[] = [];

export default function HomeLeftSidebar({
  initialUpdates = EMPTY_INITIAL_UPDATES,
  initialExams = EMPTY_INITIAL_EXAMS,
}: HomeLeftSidebarProps) {
  const {
    items: updateRows,
    hasMore: hasMoreUpdates,
    isLoadingMore: isLoadingUpdates,
    sentinelRef: updatesSentinelRef,
  } = useInfinitePagedFeed<LatestUpdate>({
    initialItems: initialUpdates,
    pageSize: PAGE_SIZE,
    fetchPage: fetchLatestUpdatesPage,
    getKey: (item) => `${item.href}|${item.title}|${item.time}`,
    rootMargin: "240px 0px",
    loadFirstPageOnMount: initialUpdates.length === 0,
  });

  const {
    items: examRows,
    hasMore: hasMoreExams,
    isLoadingMore: isLoadingExams,
    sentinelRef: examsSentinelRef,
  } = useInfinitePagedFeed<UpcomingExam>({
    initialItems: initialExams,
    pageSize: PAGE_SIZE,
    fetchPage: fetchUpcomingExamsPage,
    getKey: (item) => `${item.href}|${item.title}|${item.date}`,
    rootMargin: "240px 0px",
    loadFirstPageOnMount: initialExams.length === 0,
  });

  const updatesRowsSafe = useCallback(() => updateRows, [updateRows]);
  const examsRowsSafe = useCallback(() => examRows, [examRows]);

  return (
    <aside className="w-full space-y-2.5 max-md:max-w-none md:max-w-[272px] lg:sticky lg:self-start">
      <section className="overflow-hidden rounded-xl border-2 border-indigo-200/90 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.1)] ring-1 ring-indigo-100/80">
        <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-2 py-1.5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.25),transparent_40%)]" />
          <div className="absolute -right-5 -top-8 h-14 w-14 rounded-full bg-white/10 blur-sm" />
          <div className="relative flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="live-bell-wrap inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                <BellIcon className="h-3 w-3" />
              </span>
              <h2 className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-indigo-50">Latest Updates</h2>
            </div>
            <span className="live-chip relative rounded-full bg-white/20 px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ring-1 ring-white/25">
              Live
            </span>
          </div>
        </header>

        <div className="max-h-[280px] overflow-y-auto bg-gradient-to-b from-white to-indigo-50/20 p-1.5 [content-visibility:auto] [contain-intrinsic-size:360px] [scrollbar-color:#a5b4fc_transparent] [scrollbar-width:thin]">
          <ul className="space-y-1" aria-label="Latest updates list">
            {updatesRowsSafe().map((item, index) => (
              <li key={`${item.title}-${index}`}>
                <article className="group rounded-lg border border-indigo-100/80 bg-white/85 px-1.5 py-1 shadow-[0_10px_18px_rgba(15,23,42,0.07)] transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-200 hover:bg-white hover:shadow-[0_14px_26px_rgba(99,102,241,0.14)] focus-within:border-indigo-300">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-1.5">
                      <span className="relative mt-0.5 inline-flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <UpdateTypeIcon type={item.type} className="h-2.5 w-2.5" />
                        <span className="absolute -bottom-2.5 left-1/2 h-2 w-px -translate-x-1/2 bg-indigo-200/80" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="block truncate text-[10px] font-semibold text-slate-800 underline-offset-2 transition-colors hover:text-indigo-700 active:text-indigo-700 visited:text-indigo-700 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[9px] font-medium text-slate-500">{item.time}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                      <span
                        className={`rounded-full border px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ${getTypeStyles(item.type)}`}
                      >
                        {item.type}
                      </span>
                      {index < 2 ? (
                        <span className="rounded-full border border-rose-300 bg-rose-100 px-1.5 py-[1px] text-[8px] font-bold uppercase tracking-[0.08em] text-rose-900">
                          New
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            ))}

            <div ref={updatesSentinelRef} className="h-1" aria-hidden="true" />

            {isLoadingUpdates ? (
              <li className="rounded-md border border-indigo-100 bg-indigo-50/70 px-2 py-1 text-center text-[9px] font-semibold text-indigo-700">
                Loading 20 more updates...
              </li>
            ) : null}

            {!hasMoreUpdates && updateRows.length > 0 ? (
              <li className="text-center text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Latest updates loaded.
              </li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border-2 border-indigo-200/90 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.1)] ring-1 ring-indigo-100/80">
        <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-2 py-1.5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.25),transparent_40%)]" />
          <div className="absolute -right-5 -top-8 h-14 w-14 rounded-full bg-white/10 blur-sm" />
          <div className="relative flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                <UpdateTypeIcon type="Exam" className="h-3 w-3" />
              </span>
              <h2 className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-indigo-50">Upcoming Exams</h2>
            </div>
            <span className="rounded-full bg-white/20 px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ring-1 ring-white/25">
              Soon
            </span>
          </div>
        </header>

        <div className="max-h-[280px] overflow-y-auto bg-gradient-to-b from-white to-indigo-50/20 p-1.5 [content-visibility:auto] [contain-intrinsic-size:360px] [scrollbar-color:#a5b4fc_transparent] [scrollbar-width:thin]">
          <ul className="space-y-1" aria-label="Upcoming exams list">
            {examsRowsSafe().map((item, index) => (
              <li key={`${item.title}-${index}`}>
                <article className="group rounded-lg border border-indigo-100/80 bg-white/85 px-1.5 py-1 shadow-[0_10px_18px_rgba(15,23,42,0.07)] transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-200 hover:bg-white hover:shadow-[0_14px_26px_rgba(99,102,241,0.14)] focus-within:border-indigo-300">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-1.5">
                      <span className="relative mt-0.5 inline-flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <UpdateTypeIcon type={item.category} className="h-2.5 w-2.5" />
                        <span className="absolute -bottom-2.5 left-1/2 h-2 w-px -translate-x-1/2 bg-indigo-200/80" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="block truncate text-[10px] font-semibold text-slate-800 underline-offset-2 transition-colors hover:text-indigo-700 active:text-indigo-700 visited:text-indigo-700 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[9px] font-medium text-slate-500">{item.date}</p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ${getExamBadgeStyles(item.badge)}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                </article>
              </li>
            ))}

            <div ref={examsSentinelRef} className="h-1" aria-hidden="true" />

            {isLoadingExams ? (
              <li className="rounded-md border border-indigo-100 bg-indigo-50/70 px-2 py-1 text-center text-[9px] font-semibold text-indigo-700">
                Loading 20 more exams...
              </li>
            ) : null}

            {!hasMoreExams && examRows.length > 0 ? (
              <li className="text-center text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Latest exams loaded.
              </li>
            ) : null}
          </ul>
        </div>
      </section>
    </aside>
  );
}
