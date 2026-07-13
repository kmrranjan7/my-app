"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";

const PAGE_SIZE = 50;

type ApiAdmitItem = Readonly<{
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
    readonly content?: ApiAdmitItem[];
  };
}>;

type AdmitRow = Readonly<{
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

function buildApiUrl(page: number): string {
  return `${API_PUBLIC_BASE_URL}/jobs?postType=Admit&postStatus=Published&page=${page}&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
}

function parseDateSafe(value?: string): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;

  const ymd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const ymdMatch = ymd.exec(trimmed);
  if (ymdMatch) {
    const year = Number.parseInt(ymdMatch[1], 10);
    const month = Number.parseInt(ymdMatch[2], 10);
    const day = Number.parseInt(ymdMatch[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      !Number.isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateOnly(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function formatDate(value?: string): string {
  const parsed = parseDateSafe(value);
  if (!parsed) return "To Be Announced";
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}-${month}-${year}`;
}

function getStatus(startDate?: string, endDate?: string): string {
  const start = parseDateSafe(startDate);
  const end = parseDateSafe(endDate);
  if (!end) return "To Be Announced";
  if (!start) return "To Be Announced";

  const startOnly = toDateOnly(start);
  const endOnly = toDateOnly(end);
  const windowDays = Math.ceil((endOnly.getTime() - startOnly.getTime()) / (1000 * 60 * 60 * 24));

  if (windowDays < 0) return "Closed";
  if (windowDays === 0) return "Last day";
  return `${windowDays}d left`;
}

function mapToRow(item: ApiAdmitItem, index: number, page: number): AdmitRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Admit Card").trim();

  return {
    id: item.applicationId?.trim() || slug || `admit-${page}-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/admit-card",
    badge: item.organization?.trim() || item.applicationId?.trim() || "ADMIT",
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

async function fetchAdmitPage(page: number): Promise<AdmitRow[]> {
  try {
    const response = await fetch(buildApiUrl(page), {
      method: "GET",
      cache: "no-store",
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

function getStatusClasses(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized.includes("closed")) {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  if (normalized.includes("to be announced")) {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  if (normalized.includes("last day")) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  const dayMatch = /^(\d+)d left$/i.exec(status.trim());
  if (dayMatch) {
    const days = Number.parseInt(dayMatch[1], 10);
    if (days <= 7) return "border-rose-200 bg-rose-50 text-rose-700";
    if (days <= 15) return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-indigo-200 bg-indigo-50 text-indigo-700";
}

export default function AdmitCardPageClient() {
  const [rows, setRows] = useState<AdmitRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const nextPageRef = useRef(0);
  const hasMoreRef = useRef(true);

  const loadNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setLoadError(null);

    const page = nextPageRef.current;
    const newRows = await fetchAdmitPage(page);

    if (newRows.length === 0) {
      hasMoreRef.current = false;
      setHasMore(false);
    } else {
      setRows((prev) => [...prev, ...newRows]);
      nextPageRef.current = page + 1;
      if (newRows.length < PAGE_SIZE) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
    }

    if (!isFirstLoadDone) {
      setIsFirstLoadDone(true);
      if (newRows.length === 0) {
        setLoadError("No admit cards available right now.");
      }
    }

    setIsLoading(false);
    isFetchingRef.current = false;
  }, [isFirstLoadDone]);

  useEffect(() => {
    void loadNextPage();
  }, [loadNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          void loadNextPage();
        }
      },
      { rootMargin: "420px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage]);

  return (
    <main className="w-full py-3 sm:py-4">
      <section className="mx-auto w-[min(1220px,96vw)] space-y-2.5">
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-3 shadow-[0_14px_30px_rgba(15,23,42,0.1)] ring-1 ring-blue-100/70 sm:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.45),transparent_45%)]" />
          <p className="relative text-[11px] font-black uppercase tracking-[0.14em] text-blue-800">Admit Card</p>
          <h1 className="relative mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Fresh Published Admit Cards</h1>
          <p className="relative mt-1 text-[12px] font-medium text-slate-600">Live data from API, sorted by newest first. Auto-loads 50 more on scroll.</p>
        </div>

        {rows.length === 0 && isFirstLoadDone ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No admit cards available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please verify API response and published records.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse text-left">
                <thead className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">Admit Card</th>
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
          </section>
        )}

        {loadError && rows.length === 0 ? (
          <p className="px-1 text-[12px] font-semibold text-rose-600">{loadError}</p>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-blue-100 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-blue-700">
            Loading admit cards...
          </div>
        ) : null}

        {!hasMore && rows.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-center text-[12px] font-semibold text-slate-600">
            You have reached the end.
          </div>
        ) : null}

        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      </section>
    </main>
  );
}
