"use client";

import Link from "next/link";
import { getStatusClasses } from "@/lib/dateStatus";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import ShareActionButton from "@/components/common/ShareActionButton";
import {
  fetchLatestJobsPage,
  getLatestJobRowKey,
  LATEST_JOB_PAGE_SIZE,
  type LatestJobRow,
} from "./latestJobData";

type LatestJobPageClientProps = Readonly<{
  initialRows?: readonly LatestJobRow[];
}>;

const EMPTY_INITIAL_ROWS: readonly LatestJobRow[] = [];

type QuickLink = Readonly<{
  readonly label: string;
  readonly href: string;
}>;

const GOVT_CATEGORY_LINKS: readonly QuickLink[] = [
  { label: "SSC Jobs", href: "/?search=SSC" },
  { label: "UPSC Jobs", href: "/?search=UPSC" },
  { label: "Railway Jobs", href: "/?search=Railway" },
  { label: "Bank Jobs", href: "/?search=Bank" },
  { label: "Defence Jobs", href: "/?search=Defence" },
  { label: "Police Jobs", href: "/?search=Police" },
  { label: "Teaching Jobs", href: "/?search=Teaching" },
  { label: "PSU Jobs", href: "/?search=PSU" },
] as const;

const STATE_WISE_LINKS: readonly QuickLink[] = [
  { label: "Uttar Pradesh Jobs", href: "/?search=Uttar%20Pradesh" },
  { label: "Bihar Jobs", href: "/?search=Bihar" },
  { label: "Madhya Pradesh Jobs", href: "/?search=Madhya%20Pradesh" },
  { label: "Rajasthan Jobs", href: "/?search=Rajasthan" },
  { label: "Maharashtra Jobs", href: "/?search=Maharashtra" },
  { label: "Gujarat Jobs", href: "/?search=Gujarat" },
  { label: "Delhi Jobs", href: "/?search=Delhi" },
  { label: "West Bengal Jobs", href: "/?search=West%20Bengal" },
] as const;

export default function LatestJobPageClient({
  initialRows = EMPTY_INITIAL_ROWS,
}: LatestJobPageClientProps) {
  const {
    items: rows,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfinitePagedFeed<LatestJobRow>({
    initialItems: initialRows,
    pageSize: LATEST_JOB_PAGE_SIZE,
    fetchPage: fetchLatestJobsPage,
    getKey: getLatestJobRowKey,
    rootMargin: "340px 0px",
    loadFirstPageOnMount: initialRows.length === 0,
  });

  return (
    <main className="w-full py-2 sm:py-3 lg:py-4">
      <section className="mx-auto w-[min(1220px,94vw)] space-y-2 sm:space-y-3">
        <section className="rounded-xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/70 to-cyan-50/80 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.05)] sm:p-3 lg:p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-700 sm:text-[11px]">Latest Jobs</p>
          <h2 className="mt-1 max-w-3xl text-[17px] font-black leading-tight tracking-tight text-slate-900 sm:text-[20px] lg:text-[24px]">
          Explore the Latest Government Job Opportunities
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            Stay informed about the latest government job notifications published across India.
            Whether you are preparing for central or state recruitment, this page is refreshed regularly to help you track important vacancies without delay.
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="rounded-full border border-indigo-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-indigo-700 sm:text-[10px]">Central Jobs</span>
            <span className="rounded-full border border-cyan-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-cyan-700 sm:text-[10px]">State Jobs</span>
            <span className="rounded-full border border-blue-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-blue-700 sm:text-[10px]">Recruitment Alerts</span>
            <span className="rounded-full border border-emerald-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">Frequent Updates</span>
          </div>
        </section>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No jobs available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please verify API response and published records.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-collapse text-left">
                <thead className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Job</th>
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
                      <td className="px-2 py-2 text-[11px] font-bold text-emerald-700 align-top">{row.seats}</td>
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.startDate}</td>
                      <td className="px-2 py-2 text-[11px] font-bold text-rose-700 align-top">{row.lastDate}</td>
                      <td className="px-2 py-2 align-top">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <ShareActionButton
                          title={row.title}
                          href={row.href}
                          contextLabel="Latest Job"
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

            <div className="grid gap-1 p-1 sm:grid-cols-2 sm:gap-1.5 sm:p-1.5 lg:hidden">
              {rows.map((row, index) => (
                <article key={`${row.id}-${index}`} className="flex min-w-0 flex-col rounded-md border border-slate-200/90 bg-white p-1.5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-1">
                    <span className="max-w-[58%] truncate rounded-full border border-cyan-200 bg-cyan-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-cyan-800 sm:max-w-[62%]">
                      {row.badge}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${getStatusClasses(row.status)}`}>
                        {row.status}
                      </span>
                      <ShareActionButton
                        title={row.title}
                        href={row.href}
                        contextLabel="Latest Job"
                        details={[
                          { label: "Organization", value: row.badge },
                          { label: "State", value: row.state },
                          { label: "Seats", value: row.seats },
                          { label: "Start Date", value: row.startDate },
                          { label: "Last Date", value: row.lastDate },
                        ]}
                        showLabel={false}
                        buttonClassName="inline-flex size-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                        iconClassName="size-2.5"
                        copiedTextClassName="mt-0.5 text-[9px] font-semibold text-emerald-700"
                      />
                    </div>
                  </div>
                  <Link href={row.href} className="mt-1 block text-[11px] font-bold leading-3.5 text-slate-900 transition-colors hover:text-cyan-800 sm:text-[12px]">
                    {row.title}
                  </Link>
                  <div className="mt-1 grid grid-cols-2 gap-x-1.5 gap-y-0.5 border-t border-slate-100 pt-1 text-[8px] leading-3 text-slate-600 sm:text-[9px]">
                    <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">State</span><span className="line-clamp-1 font-semibold text-slate-700">{row.state}</span></p>
                    <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">Seats</span><span className="line-clamp-1 font-bold text-emerald-700">{row.seats}</span></p>
                    <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">Starts</span><span className="line-clamp-1 font-semibold text-slate-700">{row.startDate}</span></p>
                    <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">Last date</span><span className="line-clamp-1 font-bold text-rose-700">{row.lastDate}</span></p>
                  </div>
                </article>
              ))}
            </div>

            <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

            {isLoadingMore ? (
              <div className="border-t border-blue-100 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-blue-700">
                Loading 20 more jobs...
              </div>
            ) : null}

            {!hasMore && rows.length > 0 ? (
              <div className="border-t border-slate-200 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-slate-600">
                You have reached the end.
              </div>
            ) : null}
          </section>
        )}

        <section className="grid gap-2 md:grid-cols-2">
          <article className="rounded-xl border border-cyan-100/90 bg-white/92 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-3">
            <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900 sm:text-sm">
              More Govt Posts by Category
            </h2>
            <p className="mt-1 text-[11px] text-slate-600">
              Explore SSC, UPSC, Railway, Bank, Defence, Police, Teaching, and PSU recruitment updates.
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-1 min-[440px]:grid-cols-2">
              {GOVT_CATEGORY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex w-full justify-center rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-center text-[9px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-blue-100/90 bg-white/92 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-3">
            <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900 sm:text-sm">
              State Wise Govt Jobs
            </h2>
            <p className="mt-1 text-[11px] text-slate-600">
              Find state-wise opportunities and regional recruitment updates across major Indian states.
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-1 min-[440px]:grid-cols-2">
              {STATE_WISE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex w-full justify-center rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-center text-[9px] font-bold text-blue-800 transition-colors hover:bg-blue-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-3 lg:p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-800">Related Sections</p>
          <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
            <Link href="/results" className="rounded-md border border-blue-200 bg-white px-2 py-1.5 text-center text-[11px] font-bold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800">
              Latest Sarkari Result and Merit List Updates
            </Link>
            <Link href="/admit-cards" className="rounded-md border border-blue-200 bg-white px-2 py-1.5 text-center text-[11px] font-bold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800">
              Download Latest Admit Card and Hall Ticket
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
