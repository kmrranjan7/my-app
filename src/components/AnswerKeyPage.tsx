"use client";

import Link from "next/link";
import ShareActionButton from "@/components/common/ShareActionButton";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import { ANSWER_KEY_PAGE_SIZE, fetchAnswerKeyPage, getAnswerKeyRowKey, type AnswerKeyRow } from "@/app/answer-keys/answerKeyData";
import { GOVT_CATEGORY_LINKS, STATE_WISE_LINKS } from "@/data/jobQuickLinks";

type AnswerKeyPageProps = Readonly<{ initialRows?: readonly AnswerKeyRow[] }>;
const EMPTY_INITIAL_ROWS: readonly AnswerKeyRow[] = [];

export default function AnswerKeyPage({ initialRows = EMPTY_INITIAL_ROWS }: AnswerKeyPageProps) {
  const {
    items: rows,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfinitePagedFeed<AnswerKeyRow>({
    initialItems: initialRows,
    pageSize: ANSWER_KEY_PAGE_SIZE,
    fetchPage: fetchAnswerKeyPage,
    getKey: getAnswerKeyRowKey,
    rootMargin: "340px 0px",
    loadFirstPageOnMount: false,
  });

  return (
    <main className="w-full bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_26rem)] py-2 sm:py-3 lg:py-4">
      <section className="mx-auto w-[min(1220px,94vw)] space-y-2.5 sm:space-y-3">
        <section className="relative overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/80 to-cyan-50/90 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.07)] sm:p-4 lg:p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-indigo-700">Answer Key</p>
          <h2 className="mt-1 text-[17px] font-black tracking-tight text-slate-900 sm:text-[19px]">
          Latest Government Exam Answer Keys
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            Track provisional and final answer key notifications for major government and competitive exams across India.
            This section is refreshed regularly so you can verify responses and challenge windows on time.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">Official Keys</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700">Objection Window</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Exam-wise Filter</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Frequent Updates</span>
          </div>
        </section>

        <section className="flex items-center justify-between gap-2 rounded-xl border border-amber-100 bg-white/90 p-2 shadow-[0_6px_18px_rgba(15,23,42,0.04)] sm:px-3">
          <p className="text-[10px] font-semibold text-slate-600 sm:text-[11px]"><strong className="text-slate-800">Before you raise an objection:</strong> read the official answer-key notice carefully.</p>
          <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">Official updates</span>
        </section>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No answer key updates available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please verify API response and published answer key records.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-2.5 py-2 sm:px-3"><div><h2 className="text-[12px] font-black text-slate-900 sm:text-[13px]">Latest answer keys</h2><p className="text-[9px] text-slate-500 sm:text-[10px]">Open an update to view the official answer key.</p></div><span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700 sm:text-[10px]">{rows.length} updates</span></div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-collapse text-left">
                <thead className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Update</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Org</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">State</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Released</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Status</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Actions</th>
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
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.startDate}</td>
                      <td className="px-2 py-2 align-top">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${row.startDate === "To Be Announced" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                          {row.startDate === "To Be Announced" ? "Pending" : "Released"}
                        </span>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="flex items-center justify-between gap-2">
                          <ShareActionButton title={row.title} href={row.href} contextLabel="Answer Key" details={[{ label: "Organization", value: row.badge }, { label: "State", value: row.state }, { label: "Released", value: row.startDate }]} />
                          <Link href={row.href} className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100">View Details</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-1.5 p-1.5 sm:grid-cols-2 sm:p-2 lg:hidden">
              {rows.map((row, index) => (
                <article key={`${row.id}-${index}`} className="group rounded-xl border border-slate-200/90 bg-white p-2 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-cyan-800">
                      {row.badge}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${row.startDate === "To Be Announced" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      {row.startDate === "To Be Announced" ? "Pending" : "Released"}
                    </span>
                  </div>
                  <Link href={row.href} className="mt-1.5 block text-[12px] font-bold leading-4 text-slate-900 transition-colors hover:text-indigo-700">
                    {row.title}
                  </Link>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                    <p><span className="font-bold text-slate-700">State:</span> {row.state}</p>
                    <p><span className="font-bold text-slate-700">Released:</span> {row.startDate}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <ShareActionButton title={row.title} href={row.href} contextLabel="Answer Key" details={[{ label: "Organization", value: row.badge }, { label: "State", value: row.state }, { label: "Released", value: row.startDate }]} showLabel={false} buttonClassName="inline-flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700" iconClassName="size-3" copiedTextClassName="mt-1 text-[10px] font-semibold text-emerald-700" />
                    <Link href={row.href} className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100">View Details</Link>
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
