"use client";

import Link from "next/link";
import ShareActionButton from "@/components/common/ShareActionButton";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { formatDate } from "@/lib/dateStatus";

const EXAM_CATEGORY_LINKS = [
  { label: "SSC Exams", href: "/exam?search=SSC" },
  { label: "UPSC Exams", href: "/exam?search=UPSC" },
  { label: "Railway Exams", href: "/exam?search=Railway" },
  { label: "Bank Exams", href: "/exam?search=Bank" },
  { label: "Defence Exams", href: "/exam?search=Defence" },
  { label: "Police Exams", href: "/exam?search=Police" },
  { label: "Teaching Exams", href: "/exam?search=Teaching" },
  { label: "State Exams", href: "/exam?search=State" },
] as const;

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

type ApiExamResponse = Readonly<{
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
}>;

const PAGE_SIZE = 20;
const PUBLIC_FEED_REVALIDATE_SECONDS = 60;
const EXAM_POSTS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Exam&postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

function mapToExamRow(item: ApiExamItem, index: number, page: number): ExamRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Exam Update").trim();

  return {
    id: item.applicationId?.trim() || slug || `exam-${page}-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/exam",
    badge: item.organization?.trim() || item.applicationId?.trim() || "EXAM",
    state: item.stateName?.trim() || "All India",
    seats:
      typeof item.vacancies === "number" && Number.isFinite(item.vacancies)
        ? item.vacancies.toLocaleString("en-IN")
        : "N/A",
    startDate: formatDate(item.startDate),
  };
}

async function fetchExamPage(page: number): Promise<ExamRow[]> {
  try {
    const response = await fetch(`${EXAM_POSTS_API_URL}&page=${page}`, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiExamResponse;
    const content = payload.data?.content ?? [];
    return content.map((item, index) => mapToExamRow(item, index, page));
  } catch {
    return [];
  }
}

export default function ExamPage() {
  const {
    items: rows,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfinitePagedFeed<ExamRow>({
    pageSize: PAGE_SIZE,
    fetchPage: fetchExamPage,
    getKey: (item) => `${item.href}|${item.title}|${item.startDate}`,
    rootMargin: "340px 0px",
    loadFirstPageOnMount: true,
  });

  return (
    <main className="w-full py-3 sm:py-4">
      <section className="mx-auto w-[min(1220px,96vw)] space-y-2.5">
        <section className="rounded-2xl border border-indigo-100/90 bg-white/95 p-3 shadow-[0_12px_26px_rgba(15,23,42,0.07)] sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-indigo-700">Exam</p>
          <h2 className="mt-1 text-[17px] font-black tracking-tight text-slate-900 sm:text-[19px]">
            Welcome to Sarkari Global Result Exam Updates
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            Track latest exam notifications, schedule updates, and important announcements from official published records.
            This section is refreshed regularly so you do not miss key exam timelines.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">Exam Alerts</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700">Latest Notices</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Official Sources</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Frequent Updates</span>
          </div>
        </section>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No exam updates available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please verify API response and published exam records.</p>
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
                      <td className="px-2 py-2 align-top">
                        <ShareActionButton
                          title={row.title}
                          href={row.href}
                          contextLabel="Exam"
                          details={[
                            { label: "Organization", value: row.badge },
                            { label: "State", value: row.state },
                            { label: "Seats", value: row.seats },
                            { label: "Start Date", value: row.startDate },
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
                    <ShareActionButton
                      title={row.title}
                      href={row.href}
                      contextLabel="Exam"
                      details={[
                        { label: "Organization", value: row.badge },
                        { label: "State", value: row.state },
                        { label: "Seats", value: row.seats },
                        { label: "Start Date", value: row.startDate },
                      ]}
                      showLabel={false}
                      buttonClassName="inline-flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                      iconClassName="size-3"
                      copiedTextClassName="mt-1 text-[10px] font-semibold text-emerald-700"
                    />
                  </div>
                  <Link href={row.href} className="mt-1 block text-[12px] font-bold leading-4 text-slate-900">
                    {row.title}
                  </Link>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                    <p><span className="font-bold text-slate-700">State:</span> {row.state}</p>
                    <p><span className="font-bold text-slate-700">Seats:</span> {row.seats}</p>
                    <p><span className="font-bold text-slate-700">Start:</span> {row.startDate}</p>
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
            Exam by Category
          </h2>
          <p className="mt-1 text-[11px] text-slate-600">
            Explore exam updates for SSC, UPSC, Railway, Banking, Defence, Police, Teaching, and state-level exams.
          </p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">
            Showing records from Exam-type published posts in your API.
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {EXAM_CATEGORY_LINKS.map((item) => (
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
