"use client";

import Link from "next/link";
import { getStatusClasses } from "@/lib/dateStatus";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import {
  fetchResultsPage,
  getResultRowKey,
  RESULTS_PAGE_SIZE,
  type ResultRow,
} from "./resultData";

type ResultPageClientProps = Readonly<{
  initialRows?: readonly ResultRow[];
}>;

const EMPTY_INITIAL_ROWS: readonly ResultRow[] = [];

export default function ResultPageClient({
  initialRows = EMPTY_INITIAL_ROWS,
}: ResultPageClientProps) {
  const {
    items: rows,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfinitePagedFeed<ResultRow>({
    initialItems: initialRows,
    pageSize: RESULTS_PAGE_SIZE,
    fetchPage: fetchResultsPage,
    getKey: getResultRowKey,
    rootMargin: "340px 0px",
    loadFirstPageOnMount: initialRows.length === 0,
  });

  return (
    <main className="w-full py-3 sm:py-4">
      <section className="mx-auto w-[min(1220px,96vw)] space-y-2.5">
        <section>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-indigo-700">Results</p>
          <h2 className="mt-1 text-[17px] font-black tracking-tight text-slate-900 sm:text-[19px]">
            Welcome to Sarkari Global Result Latest Result Updates
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            Stay informed about the latest result announcements for competitive exams, recruitment tests, and major government selections.
            This page is updated frequently so you can quickly find fresh result releases and important merit list notifications.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">Official Results</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700">Merit Lists</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Selection Updates</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Frequent Updates</span>
          </div>
        </section>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No results available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please verify API response and published records.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse text-left">
                <thead className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Result</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Org</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">State</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Seats</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Start</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Last</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Status</th>
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
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(row.status)}`}>
                      {row.status}
                    </span>
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
                Loading 20 more results...
              </div>
            ) : null}

            {!hasMore && rows.length > 0 ? (
              <div className="border-t border-slate-200 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-slate-600">
                You have reached the end.
              </div>
            ) : null}
          </section>
        )}

        <section className="rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-3 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-800">Related Sections</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/latest-job" className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800">
              Latest Govt Jobs Updates
            </Link>
            <Link href="/admit-card" className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800">
              Latest Admit Card Download
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-100/90 bg-white/92 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900">
            More Govt Posts by Category
          </h2>
          <p className="mt-1 text-[11px] text-slate-600">
            Explore high-demand government recruitment categories with quick navigation for SSC, UPSC, Railway, Bank, Defence, Police, Teaching, and PSU updates.
          </p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">
              Daily refreshed listings
            </p>
            <p className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-800">
              Official notification focused
            </p>
            <p className="rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-800">
              Faster category discovery
            </p>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            <li>
              <Link href="/latest-job?search=SSC" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">SSC Jobs</Link>
            </li>
            <li>
              <Link href="/latest-job?search=UPSC" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">UPSC Jobs</Link>
            </li>
            <li>
              <Link href="/latest-job?search=Railway" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">Railway Jobs</Link>
            </li>
            <li>
              <Link href="/latest-job?search=Bank" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">Bank Jobs</Link>
            </li>
            <li>
              <Link href="/latest-job?search=Defence" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">Defence Jobs</Link>
            </li>
            <li>
              <Link href="/latest-job?search=Police" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">Police Jobs</Link>
            </li>
            <li>
              <Link href="/latest-job?search=Teaching" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">Teaching Jobs</Link>
            </li>
            <li>
              <Link href="/latest-job?search=PSU" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">PSU Jobs</Link>
            </li>
          </ul>
        </section>
      </section>
    </main>
  );
}
