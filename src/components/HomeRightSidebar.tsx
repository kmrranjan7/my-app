"use client";

import Link from "next/link";
import { useCallback } from "react";
import { type RefObject } from "react";
import { type RightSideItem } from "@/data/sidebarContent";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";

const PAGE_SIZE = 10;
const PUBLIC_FEED_REVALIDATE_SECONDS = 60;
const ADMIT_CARDS_API_URL =
  `${API_PUBLIC_BASE_URL}/jobs?postType=Admit&postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
const RESULTS_API_URL =
  `${API_PUBLIC_BASE_URL}/jobs?postType=Result&postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type PublicJobsApiItem = Readonly<{
  readonly createdAt?: string;
  readonly startDate?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postTitle?: string;
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

function getTextHash(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    const codePoint = value.codePointAt(i) ?? 0;
    hash = Math.trunc((hash * 31 + codePoint) % 2147483647);
  }

  return Math.abs(hash);
}

function getDynamicBadgeStyles(value: string) {
  if (!value.trim()) {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  const colorIndex = getTextHash(value.toLowerCase()) % dynamicBadgePalettes.length;
  return dynamicBadgePalettes[colorIndex];
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
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2 2" />
    </svg>
  );
}

function formatDate(value?: string): string {
  if (!value) return "Date TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBA";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function mapAdmitApiItem(item: PublicJobsApiItem): RightSideItem {
  const slug = item.postSlug?.trim();
  const organization = item.organization?.trim();
  return {
    title: item.postTitle?.trim() || "Untitled Admit Card",
    startDate: item.startDate || item.createdAt || "",
    category: "Admit Card",
    badge: organization || "Admit",
    href: slug ? `/${slug}` : "/admit-card",
  };
}

async function fetchAdmitCardsPage(page: number): Promise<RightSideItem[]> {
  try {
    const response = await fetch(`${ADMIT_CARDS_API_URL}&page=${page}`, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as PublicJobsApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapAdmitApiItem);
  } catch {
    return [];
  }
}

function mapResultApiItem(item: PublicJobsApiItem): RightSideItem {
  const slug = item.postSlug?.trim();
  const organization = item.organization?.trim();
  return {
    title: item.postTitle?.trim() || "Untitled Result",
    startDate: item.startDate || item.createdAt || "",
    category: "Result",
    badge: organization || "Result",
    href: slug ? `/results/${slug}` : "/results",
  };
}

async function fetchResultsPage(page: number): Promise<RightSideItem[]> {
  try {
    const response = await fetch(`${RESULTS_API_URL}&page=${page}`, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as PublicJobsApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapResultApiItem);
  } catch {
    return [];
  }
}

function SidebarCard({
  title,
  badge,
  rows,
  hasMore,
  isLoadingMore,
  sentinelRef,
  loadingLabel,
  endLabel,
}: Readonly<{
  title: string;
  badge: string;
  rows: readonly RightSideItem[];
  hasMore: boolean;
  isLoadingMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  loadingLabel: string;
  endLabel: string;
}>) {
  return (
    <section className="overflow-hidden rounded-xl border-2 border-indigo-200/90 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.1)] ring-1 ring-indigo-100/80">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-2 py-1.5 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_45%)]" />
        <div className="absolute -right-5 -top-8 h-14 w-14 rounded-full bg-white/10 blur-sm" />
        <div className="relative flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
              <UpdateTypeIcon type={title} className="h-3 w-3" />
            </span>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-indigo-50">{title}</h2>
          </div>
          <span className="rounded-full bg-white/20 px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ring-1 ring-white/25">
            {badge}
          </span>
        </div>
      </header>

      <div className="max-h-[280px] overflow-y-auto bg-gradient-to-b from-white to-indigo-50/20 p-1.5 [content-visibility:auto] [contain-intrinsic-size:360px] [scrollbar-color:#a5b4fc_transparent] [scrollbar-width:thin]">
        <ul className="space-y-1" aria-label={`${title} list`}>
          {rows.map((item, index) => (
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
                      <p className="text-[9px] font-medium text-slate-500">{formatDate(item.startDate)}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ${getDynamicBadgeStyles(item.badge)}`}
                  >
                    {item.badge}
                  </span>
                </div>
              </article>
            </li>
          ))}

          <div ref={sentinelRef} className="h-1" aria-hidden="true" />

          {isLoadingMore ? (
            <li className="rounded-md border border-indigo-100 bg-indigo-50/70 px-2 py-1 text-center text-[9px] font-semibold text-indigo-700">
              {loadingLabel}
            </li>
          ) : null}

          {!hasMore && rows.length > 0 ? (
            <li className="text-center text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              {endLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}

type HomeRightSidebarProps = Readonly<{
  initialAdmitCards?: readonly RightSideItem[];
  initialResults?: readonly RightSideItem[];
}>;

const EMPTY_INITIAL_ADMIT_CARDS: readonly RightSideItem[] = [];
const EMPTY_INITIAL_RESULTS: readonly RightSideItem[] = [];

export default function HomeRightSidebar({
  initialAdmitCards = EMPTY_INITIAL_ADMIT_CARDS,
  initialResults = EMPTY_INITIAL_RESULTS,
}: HomeRightSidebarProps) {
  const {
    items: admitRows,
    hasMore: hasMoreAdmit,
    isLoadingMore: isLoadingAdmit,
    sentinelRef: admitSentinelRef,
  } = useInfinitePagedFeed<RightSideItem>({
    initialItems: initialAdmitCards,
    pageSize: PAGE_SIZE,
    fetchPage: fetchAdmitCardsPage,
    getKey: (item) => `${item.href}|${item.title}|${item.startDate}`,
    rootMargin: "240px 0px",
    loadFirstPageOnMount: initialAdmitCards.length === 0,
  });

  const {
    items: resultRows,
    hasMore: hasMoreResult,
    isLoadingMore: isLoadingResult,
    sentinelRef: resultSentinelRef,
  } = useInfinitePagedFeed<RightSideItem>({
    initialItems: initialResults,
    pageSize: PAGE_SIZE,
    fetchPage: fetchResultsPage,
    getKey: (item) => `${item.href}|${item.title}|${item.startDate}`,
    rootMargin: "240px 0px",
    loadFirstPageOnMount: initialResults.length === 0,
  });

  const admitRowsSafe = useCallback(() => admitRows, [admitRows]);
  const resultRowsSafe = useCallback(() => resultRows, [resultRows]);

  return (
    <aside className="w-full space-y-2.5 max-md:max-w-none md:ml-auto md:max-w-[272px] lg:sticky lg:self-start">
      <SidebarCard
        title="Admit Card"
        badge="New"
        rows={admitRowsSafe()}
        hasMore={hasMoreAdmit}
        isLoadingMore={isLoadingAdmit}
        sentinelRef={admitSentinelRef}
        loadingLabel="Loading 20 more admit cards..."
        endLabel="Latest admit cards loaded."
      />
      <SidebarCard
        title="Result"
        badge="Hot"
        rows={resultRowsSafe()}
        hasMore={hasMoreResult}
        isLoadingMore={isLoadingResult}
        sentinelRef={resultSentinelRef}
        loadingLabel="Loading 20 more results..."
        endLabel="Latest results loaded."
      />
    </aside>
  );
}
