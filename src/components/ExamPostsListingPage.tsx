"use client";

import Link from "next/link";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { formatDate, getStatus, getStatusClasses } from "@/lib/dateStatus";
import ShareActionButton from "@/components/common/ShareActionButton";

type ApiExamItem = Readonly<{
  readonly applicationId?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postTitle?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly stateName?: string;
  readonly vacancies?: number;
}>;

type ApiResponse = Readonly<{
  readonly data?: {
    readonly content?: ApiExamItem[];
  };
}>;

type ExamRow = Readonly<{
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly badge: string;
  readonly state: string;
  readonly seats: string;
  readonly startDate: string;
  readonly lastDate: string;
  readonly status: string;
}>;

type CategoryChip = Readonly<{
  readonly label: string;
  readonly href: string;
}>;

type ExamPostsListingPageProps = Readonly<{
  pageLabel: string;
  pageTitle: string;
  introText: string;
  emptyTitle: string;
  emptyDescription: string;
  statusText: string;
  categoryTitle: string;
  categoryDescription: string;
  categoryChips: readonly CategoryChip[];
  apiBaseQuery?: string;
}>;

const PAGE_SIZE = 20;
const PUBLIC_FEED_REVALIDATE_SECONDS = 60;
const EXAM_POSTS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Exam&postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
const DEFAULT_POSTS_API_QUERY = "postType=Exam&postStatus=Published&sortBy=createdAt&sortDir=desc";

function mapToRow(item: ApiExamItem, index: number, page: number): ExamRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Update").trim();

  return {
    id: item.applicationId?.trim() || slug || `exam-${page}-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/latest-job",
    badge: item.organization?.trim() || item.applicationId?.trim() || "EXAM",
    state: item.stateName?.trim() || "All India",
    seats:
      typeof item.vacancies === "number" && Number.isFinite(item.vacancies)
        ? item.vacancies.toLocaleString("en-IN")
        : "N/A",
    startDate: formatDate(item.startDate),
    lastDate: formatDate(item.endDate),
    status: getStatus(item.startDate, item.endDate),
  };
}

async function fetchExamPostsPage(page: number, apiUrl: string): Promise<ExamRow[]> {
  try {
    const response = await fetch(`${apiUrl}&page=${page}`, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiResponse;
    const content = payload.data?.content ?? [];
    return content.map((item, index) => mapToRow(item, index, page));
  } catch {
    return [];
  }
}

export default function ExamPostsListingPage({
  pageLabel,
  pageTitle,
  introText,
  emptyTitle,
  emptyDescription,
  statusText,
  categoryTitle,
  categoryDescription,
  categoryChips,
  apiBaseQuery,
}: ExamPostsListingPageProps) {
  const effectiveApiUrl = apiBaseQuery
    ? `${API_PUBLIC_BASE_URL}/jobs?${apiBaseQuery}&size=${PAGE_SIZE}`
    : EXAM_POSTS_API_URL;

  const {
    items: rows,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfinitePagedFeed<ExamRow>({
    pageSize: PAGE_SIZE,
    fetchPage: (page) => fetchExamPostsPage(page, effectiveApiUrl),
    getKey: (item) => `${item.href}|${item.title}|${item.startDate}|${item.lastDate}`,
    rootMargin: "340px 0px",
    loadFirstPageOnMount: true,
  });

  return (
    <main className="w-full py-3 sm:py-4">
      <section className="mx-auto w-[min(1220px,96vw)] space-y-2.5">
        <section className="rounded-2xl border border-indigo-100/90 bg-white/95 p-3 shadow-[0_12px_26px_rgba(15,23,42,0.07)] sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-indigo-700">{pageLabel}</p>
          <h2 className="mt-1 text-[17px] font-black tracking-tight text-slate-900 sm:text-[19px]">
            Welcome to Sarkari Global Result {pageLabel} Updates
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            Stay informed about the latest {pageLabel.toLowerCase()} notifications for government and competitive exam updates across India.
            This section is refreshed regularly so you can track important releases without missing any critical notice.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">Govt Notices</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700">Exam Updates</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Official Sources</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Frequent Updates</span>
          </div>
        </section>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">{emptyTitle}</p>
            <p className="mt-1 text-sm text-slate-500">{emptyDescription}</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse text-left">
                <thead className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Update</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Org</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">State</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Seats</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Start</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Last</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Status</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`${row.id}-${index}`} className="border-t border-slate-100 transition-colors hover:bg-cyan-50/50">
                      <td className="max-w-[420px] px-3 py-2 align-top">
                        <Link href={row.href} className="line-clamp-2 text-[12px] font-bold leading-4 text-slate-900 hover:text-cyan-800">
                          {row.title}
                        </Link>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-cyan-800">
                          {row.badge}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.state}</td>
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.seats}</td>
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.startDate}</td>
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.lastDate}</td>
                      <td className="px-2 py-2 align-top">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <ShareActionButton
                          title={row.title}
                          href={row.href}
                          contextLabel={pageLabel}
                          details={[
                            { label: "Organization", value: row.badge },
                            { label: "State", value: row.state },
                            { label: "Seats", value: row.seats },
                            { label: "Start Date", value: row.startDate },
                            { label: "Last Date", value: row.lastDate },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1.5 p-2 md:hidden">
              {rows.map((row, index) => (
                <article key={`${row.id}-${index}`} className="rounded-xl border border-slate-200/90 bg-white p-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-cyan-800">
                      {row.badge}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(row.status)}`}>
                        {row.status}
                      </span>
                      <ShareActionButton
                        title={row.title}
                        href={row.href}
                        contextLabel={pageLabel}
                        details={[
                          { label: "Organization", value: row.badge },
                          { label: "State", value: row.state },
                          { label: "Seats", value: row.seats },
                          { label: "Start Date", value: row.startDate },
                          { label: "Last Date", value: row.lastDate },
                        ]}
                        showLabel={false}
                        buttonClassName="inline-flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                        iconClassName="size-3"
                        copiedTextClassName="mt-1 text-[10px] font-semibold text-emerald-700"
                      />
                    </div>
                  </div>
                  <Link href={row.href} className="mt-1 block text-[12px] font-bold leading-4 text-slate-900">
                    {row.title}
                  </Link>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                    <p><span className="font-bold text-slate-700">State:</span> {row.state}</p>
                    <p><span className="font-bold text-slate-700">Seats:</span> {row.seats}</p>
                    <p><span className="font-bold text-slate-700">Start:</span> {row.startDate}</p>
                    <p><span className="font-bold text-slate-700">Last:</span> {row.lastDate}</p>
                  </div>
                </article>
              ))}
            </div>

            <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

            {isLoadingMore ? (
              <div className="border-t border-blue-100 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-blue-700">
                Loading 20 more...
              </div>
            ) : null}

            {!hasMore && rows.length > 0 ? (
              <div className="border-t border-slate-200 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-slate-600">
                You have reached the end.
              </div>
            ) : null}
          </section>
        )}

        <section className="rounded-2xl border border-cyan-100/90 bg-white/92 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900">
            {categoryTitle}
          </h2>
          <p className="mt-1 text-[11px] text-slate-600">
            {categoryDescription}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">{statusText}</p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {categoryChips.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
