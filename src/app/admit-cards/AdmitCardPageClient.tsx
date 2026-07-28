"use client";

import Link from "next/link";
import { BellRing, CheckCircle2, FileCheck2 } from "lucide-react";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import ShareActionButton from "@/components/common/ShareActionButton";
import {
  GOVT_CATEGORY_LINKS as EXAM_CATEGORY_LINKS,
  STATE_WISE_LINKS,
} from "@/data/jobQuickLinks";
import {
  ADMIT_CARD_PAGE_SIZE,
  fetchAdmitCardsPage,
  getAdmitRowKey,
  type AdmitRow,
} from "./admitCardData";

type AdmitCardPageClientProps = Readonly<{
  initialRows?: readonly AdmitRow[];
}>;

const EMPTY_INITIAL_ROWS: readonly AdmitRow[] = [];

export default function AdmitCardPageClient({
  initialRows = EMPTY_INITIAL_ROWS,
}: AdmitCardPageClientProps) {
  const { items: rows, hasMore, isLoadingMore, sentinelRef } = useInfinitePagedFeed<AdmitRow>({
    initialItems: initialRows,
    pageSize: ADMIT_CARD_PAGE_SIZE,
    fetchPage: fetchAdmitCardsPage,
    getKey: getAdmitRowKey,
    rootMargin: "340px 0px",
    loadFirstPageOnMount: initialRows.length === 0,
  });

  return (
    <main className="w-full bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_26rem)] py-2 sm:py-3 lg:py-4">
      <section className="mx-auto w-[min(1220px,94vw)] space-y-2.5 sm:space-y-3">
        <section className="relative isolate overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/80 to-cyan-50/90 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.07)] sm:p-4 lg:p-5">
          <div className="pointer-events-none absolute -right-14 -top-20 size-48 rounded-full bg-cyan-200/50 blur-3xl" />
          <div className="relative">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-indigo-700 sm:text-[11px]"><span className="flex size-5 items-center justify-center rounded-md bg-indigo-600 text-white"><FileCheck2 className="size-3" aria-hidden="true" /></span> Admit Cards</p>
          <h1 className="mt-2 max-w-3xl text-[18px] font-black leading-tight tracking-tight text-slate-900 sm:text-[21px] lg:text-[25px]">
          Latest Government Exam Admit Cards
          </h1>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            Track official hall ticket releases for recruitment and entrance exams across India. Open an update to find your admit card, exam instructions, and reporting details in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-indigo-700 sm:text-[10px]">Official Updates</span>
            <span className="rounded-full border border-cyan-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-cyan-700 sm:text-[10px]">Hall Tickets</span>
            <span className="rounded-full border border-blue-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-blue-700 sm:text-[10px]">Exam Instructions</span>
            <span className="rounded-full border border-emerald-200 bg-white/80 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">Frequent Updates</span>
          </div>
          </div>
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-amber-100 bg-white/90 p-2 shadow-[0_6px_18px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-3">
          <p className="flex items-center gap-2 text-[10px] font-semibold leading-4 text-slate-600 sm:text-[11px]"><span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600"><BellRing className="size-3.5" aria-hidden="true" /></span><span><strong className="text-slate-800">Ready to download?</strong> Keep your registration number and date of birth handy.</span></p>
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]"><CheckCircle2 className="size-3" aria-hidden="true" /> Official links</span>
        </section>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No admit cards available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please check back soon for the latest official releases.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-2.5 py-2 sm:px-3">
              <div><h2 className="text-[12px] font-black text-slate-900 sm:text-[13px]">Latest Updates</h2><p className="text-[9px] text-slate-500 sm:text-[10px]">Open an update to view the official download instructions.</p></div>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700 sm:text-[10px]">{rows.length} updates</span>
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-collapse text-left">
                <thead className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Admit Card</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Org</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">State</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Released</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`${row.id}-${index}`} className="border-t border-slate-100 transition-colors hover:bg-cyan-50/50">
                      <td className="max-w-[420px] px-3 py-2 align-top"><div className="flex items-start justify-between gap-2"><Link href={row.href} className="line-clamp-2 text-[12px] font-bold leading-4 text-slate-900 hover:text-cyan-800">{row.title}</Link><span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${row.startDate === "To Be Announced" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{row.startDate === "To Be Announced" ? "Pending" : "Released"}</span></div></td>
                      <td className="px-2 py-2 align-top"><span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-cyan-800">{row.badge}</span></td>
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.state}</td>
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.startDate}</td>
                      <td className="px-2 py-2 align-top"><div className="flex items-center justify-between gap-2"><ShareActionButton title={row.title} href={row.href} contextLabel="Admit Card" details={[{ label: "Organization", value: row.badge }, { label: "State", value: row.state }, { label: "Released", value: row.startDate }]} /><Link href={row.href} className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100">View Details</Link></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-1.5 p-1.5 sm:grid-cols-2 sm:p-2 lg:hidden">
              {rows.map((row, index) => (
                <article key={`${row.id}-${index}`} className="rounded-xl border border-slate-200/90 bg-white p-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-cyan-800">{row.badge}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${row.startDate === "To Be Announced" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{row.startDate === "To Be Announced" ? "Pending" : "Admit Card Released"}</span>
                  </div>
                  <Link href={row.href} className="mt-1 block text-[12px] font-bold leading-4 text-slate-900">{row.title}</Link>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                    <p><span className="font-bold text-slate-700">State:</span> {row.state}</p>
                    <p><span className="font-bold text-slate-700">Released:</span> {row.startDate}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <ShareActionButton title={row.title} href={row.href} contextLabel="Admit Card" details={[{ label: "Organization", value: row.badge }, { label: "State", value: row.state }, { label: "Released", value: row.startDate }]} showLabel={false} buttonClassName="inline-flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700" iconClassName="size-3" copiedTextClassName="mt-1 text-[10px] font-semibold text-emerald-700" />
                    <Link href={row.href} className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100">View Details</Link>
                  </div>
                </article>
              ))}
            </div>

            <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
            {isLoadingMore ? <div className="border-t border-blue-100 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-blue-700">Loading 20 more admit cards...</div> : null}
            {!hasMore && rows.length > 0 ? <div className="border-t border-slate-200 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-slate-600">You have reached the end.</div> : null}
          </section>
        )}

        <section className="grid gap-2 md:grid-cols-2">
          <article className="rounded-xl border border-cyan-100/90 bg-white/92 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-3">
            <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900 sm:text-sm">Admit Cards by Exam Category</h2>
            <p className="mt-1 text-[11px] text-slate-600">Quickly track hall tickets from SSC, UPSC, Railway, Bank, Defence, Police, Teaching, and PSU exams.</p>
            <ul className="mt-2 grid grid-cols-1 gap-1 min-[440px]:grid-cols-2">
              {EXAM_CATEGORY_LINKS.map((item) => <li key={item.label}><Link href={item.href} className="inline-flex w-full justify-center rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-center text-[9px] font-bold text-cyan-800 transition-colors hover:bg-cyan-100">{item.label}</Link></li>)}
            </ul>
          </article>
          <article className="rounded-xl border border-blue-100/90 bg-white/92 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-3">
            <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900 sm:text-sm">State Wise Exam Updates</h2>
            <p className="mt-1 text-[11px] text-slate-600">Browse regional recruitment and exam updates across major Indian states.</p>
            <ul className="mt-2 grid grid-cols-1 gap-1 min-[440px]:grid-cols-2">
              {STATE_WISE_LINKS.map((item) => <li key={item.label}><Link href={item.href} className="inline-flex w-full justify-center rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-center text-[9px] font-bold text-blue-800 transition-colors hover:bg-blue-100">{item.label}</Link></li>)}
            </ul>
          </article>
        </section>

        <section className="rounded-xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-3 lg:p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-800">Related Sections</p>
          <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
            <Link href="/latest-job" className="rounded-md border border-blue-200 bg-white px-2 py-1.5 text-center text-[11px] font-bold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800">Latest Government Job Notifications</Link>
            <Link href="/result" className="rounded-md border border-blue-200 bg-white px-2 py-1.5 text-center text-[11px] font-bold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-800">Latest Sarkari Result and Merit List Updates</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
