import type { Metadata } from "next";
import Link from "next/link";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";

const LATEST_JOBS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Job&postStatus=Published&page=0&size=20&sortBy=createdAt&sortDir=desc`;

type ApiJobItem = Readonly<{
  readonly applicationId?: string;
  readonly createdAt?: string;
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
    readonly content?: ApiJobItem[];
  };
}>;

type LatestJobRow = Readonly<{
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

type QuickLink = Readonly<{
  readonly label: string;
  readonly href: string;
}>;

const GOVT_CATEGORY_LINKS: readonly QuickLink[] = [
  { label: "SSC Jobs", href: "/latest-job?search=SSC" },
  { label: "UPSC Jobs", href: "/latest-job?search=UPSC" },
  { label: "Railway Jobs", href: "/latest-job?search=Railway" },
  { label: "Bank Jobs", href: "/latest-job?search=Bank" },
  { label: "Defence Jobs", href: "/latest-job?search=Defence" },
  { label: "Police Jobs", href: "/latest-job?search=Police" },
  { label: "Teaching Jobs", href: "/latest-job?search=Teaching" },
  { label: "PSU Jobs", href: "/latest-job?search=PSU" },
] as const;

const STATE_WISE_LINKS: readonly QuickLink[] = [
  { label: "Uttar Pradesh Jobs", href: "/latest-job?search=Uttar%20Pradesh" },
  { label: "Bihar Jobs", href: "/latest-job?search=Bihar" },
  { label: "Madhya Pradesh Jobs", href: "/latest-job?search=Madhya%20Pradesh" },
  { label: "Rajasthan Jobs", href: "/latest-job?search=Rajasthan" },
  { label: "Maharashtra Jobs", href: "/latest-job?search=Maharashtra" },
  { label: "Gujarat Jobs", href: "/latest-job?search=Gujarat" },
  { label: "Delhi Jobs", href: "/latest-job?search=Delhi" },
  { label: "West Bengal Jobs", href: "/latest-job?search=West%20Bengal" },
] as const;

export const metadata: Metadata = {
  title: "Latest Govt Jobs 2026 - Sarkari Job Notifications",
  description: "Browse latest SSC, UPSC, Railway, Bank, Defence, Police, Teaching, PSU, and all other government jobs with state-wise and central vacancy updates.",
  keywords: [
    "ssc jobs",
    "upsc jobs",
    "railway jobs",
    "bank jobs",
    "state wise government jobs",
    "central government jobs",
    "latest sarkari naukri",
    "all govt post",
  ],
  alternates: {
    canonical: "/latest-job",
  },
};

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
  const endOnly = toDateOnly(end);
  const today = toDateOnly(new Date());

  if (start) {
    const startOnly = toDateOnly(start);
    if (startOnly.getTime() > endOnly.getTime()) return "To Be Announced";

    if (today.getTime() < startOnly.getTime()) {
      const startsInDays = Math.ceil((startOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return `${startsInDays}d left`;
    }
  }

  const windowDays = Math.ceil((endOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (windowDays < 0) return "Closed";
  if (windowDays === 0) return "Last day";
  return `${windowDays}d left`;
}

function mapToRow(item: ApiJobItem, index: number): LatestJobRow {
  const slug = (item.postSlug || "").trim();
  const title = (item.postTitle || "Untitled Job").trim();

  return {
    id: item.applicationId?.trim() || slug || `row-${index + 1}`,
    title,
    href: slug ? `/${slug}` : "/latest-job",
    badge: item.organization?.trim() || item.applicationId?.trim() || "JOB",
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

async function fetchLatestJobs(): Promise<LatestJobRow[]> {
  try {
    const response = await fetch(LATEST_JOBS_API_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiResponse;
    const content = payload.data?.content ?? [];
    return content.map((item, index) => mapToRow(item, index));
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

export default async function LatestJobPage() {
  const rows = await fetchLatestJobs();

  return (
    <main className="w-full py-3 sm:py-4">
      <section className="mx-auto w-[min(1220px,96vw)] space-y-2.5">
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-3 shadow-[0_14px_30px_rgba(15,23,42,0.1)] ring-1 ring-blue-100/70 sm:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.45),transparent_45%)]" />
          <p className="relative text-[11px] font-black uppercase tracking-[0.14em] text-blue-800">Latest Jobs</p>
          <h1 className="relative mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Fresh Published Jobs</h1>
          <p className="relative mt-1 text-[12px] font-medium text-slate-600">
            Live data for SSC, UPSC, Railway, Bank, and all government post types including state-wise vacancies.
          </p>
        </div>

        {rows.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white/85 px-4 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <p className="text-base font-bold text-slate-800">No jobs available right now</p>
            <p className="mt-1 text-sm text-slate-500">Please verify API response and published records.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-cyan-100/90 bg-white/92 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="hidden overflow-x-auto md:block">
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

        <section className="grid gap-2 sm:grid-cols-2">
          <article className="rounded-2xl border border-cyan-100/90 bg-white/92 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900">
              More Govt Posts by Category
            </h2>
            <p className="mt-1 text-[11px] text-slate-600">
              Explore SSC, UPSC, Railway, Bank, Defence, Police, Teaching, and PSU recruitment updates.
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {GOVT_CATEGORY_LINKS.map((item) => (
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
          </article>

          <article className="rounded-2xl border border-blue-100/90 bg-white/92 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <h2 className="text-[13px] font-black uppercase tracking-[0.08em] text-slate-900">
              State Wise Govt Jobs
            </h2>
            <p className="mt-1 text-[11px] text-slate-600">
              Find state-wise opportunities and regional recruitment updates across major Indian states.
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {STATE_WISE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-800 transition-colors hover:bg-blue-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}