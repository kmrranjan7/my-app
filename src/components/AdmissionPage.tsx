"use client";

import Link from "next/link";
import ShareActionButton from "@/components/common/ShareActionButton";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import { ADMISSION_PAGE_SIZE, fetchAdmissionPage, getAdmissionRowKey, type AdmissionRow } from "@/app/admissions/admissionData";

const ADMISSION_CATEGORY_LINKS = [
  { label: "UG Admissions", href: "/admission?search=UG" },
  { label: "PG Admissions", href: "/admission?search=PG" },
  { label: "Diploma Admissions", href: "/admission?search=Diploma" },
  { label: "ITI Admissions", href: "/admission?search=ITI" },
  { label: "Engineering Admission", href: "/admission?search=Engineering" },
  { label: "Medical Admission", href: "/admission?search=Medical" },
  { label: "Law Admission", href: "/admission?search=Law" },
  { label: "Entrance Updates", href: "/admission?search=Entrance" },
] as const;

function getDurationBadgeClasses(duration: string): string {
  if (duration === "Invalid dates") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (duration === "0d left") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (duration === "To Be Announced") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

type AdmissionPageProps = Readonly<{ initialRows?: readonly AdmissionRow[] }>;
const EMPTY_INITIAL_ROWS: readonly AdmissionRow[] = [];

export default function AdmissionPage({ initialRows = EMPTY_INITIAL_ROWS }: AdmissionPageProps) {
  const {
    items: rows,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfinitePagedFeed<AdmissionRow>({
    initialItems: initialRows,
    pageSize: ADMISSION_PAGE_SIZE,
    fetchPage: fetchAdmissionPage,
    getKey: getAdmissionRowKey,
    rootMargin: "340px 0px",
    loadFirstPageOnMount: false,
  });

  return (
    <main className="w-full bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_26rem)] py-2 sm:py-3 lg:py-4">
      <section className="mx-auto w-[min(1220px,94vw)] space-y-2.5 sm:space-y-3">
        <section className="relative overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/80 to-cyan-50/90 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.07)] sm:p-4 lg:p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-indigo-700">Admission</p>
          <h2 className="mt-1 text-[17px] font-black tracking-tight text-slate-900 sm:text-[19px]">
            Welcome to Sarkari Global Result Admission Updates
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
            Stay informed about the latest admission notifications for government and competitive exam updates across India.
            This section is refreshed regularly so you can track important releases without missing any critical notice.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">Govt Notices</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700">Entrance Updates</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Official Sources</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Frequent Updates</span>
          </div>
        </section>

        <section className="flex items-center justify-between gap-2 rounded-xl border border-amber-100 bg-white/90 p-2 shadow-[0_6px_18px_rgba(15,23,42,0.04)] sm:px-3">
          <p className="text-[10px] font-semibold text-slate-600 sm:text-[11px]"><strong className="text-slate-800">Before you apply:</strong> keep your required documents and application details ready.</p>
          <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">Official updates</span>
        </section>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No admission updates available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please verify API response and published admission records.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-collapse text-left">
                <thead className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Update</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Org</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">State</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Seats</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Start Date</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Last Date</th>
                    <th className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Duration</th>
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
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-700 align-top">{row.lastDate}</td>
                      <td className="px-2 py-2 align-top">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getDurationBadgeClasses(row.duration)}`}>
                          {row.duration}
                        </span>
                      </td>
                      <td className="px-2 py-2 align-top"><ShareActionButton title={row.title} href={row.href} contextLabel="Admission" details={[{ label: "Organization", value: row.badge }, { label: "State", value: row.state }, { label: "Seats", value: row.seats }, { label: "Start Date", value: row.startDate }, { label: "Last Date", value: row.lastDate }]} /></td>
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
                    <div className="flex shrink-0 items-center gap-1"><span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${getDurationBadgeClasses(row.duration)}`}>{row.duration}</span><ShareActionButton title={row.title} href={row.href} contextLabel="Admission" details={[{ label: "Organization", value: row.badge }, { label: "State", value: row.state }, { label: "Seats", value: row.seats }, { label: "Start Date", value: row.startDate }, { label: "Last Date", value: row.lastDate }]} showLabel={false} buttonClassName="inline-flex size-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800" iconClassName="size-2.5" copiedTextClassName="mt-0.5 text-[9px] font-semibold text-emerald-700" /></div>
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
            Top Admission Categories
          </h2>
          <p className="mt-1 text-[11px] text-slate-600">
            Explore UG, PG, Diploma, ITI, and entrance-focused admission updates.
          </p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">
            Showing records from Admission-type published posts in your API.
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {ADMISSION_CATEGORY_LINKS.map((item) => (
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
