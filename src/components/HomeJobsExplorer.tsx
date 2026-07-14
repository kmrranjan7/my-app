"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bookmark,
  CalendarClock,
  CalendarRange,
  ChevronRight,
  Filter,
  GraduationCap,
  Search,
  MapPin,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { LatestJob } from "@/data/sidebarContent";

const qualificationOptions = [
  "Below 10th Pass",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post Graduate",
] as const;

type QualificationFilter = "all" | (typeof qualificationOptions)[number];

const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

const badgeStyles = [
  "bg-gradient-to-r from-blue-50 to-sky-50 text-sky-700 ring-1 ring-sky-200",
  "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 ring-1 ring-emerald-200",
  "bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 ring-1 ring-violet-200",
  "bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 ring-1 ring-amber-200",
  "bg-gradient-to-r from-cyan-50 to-blue-50 text-blue-700 ring-1 ring-blue-200",
  "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 ring-1 ring-indigo-200",
  "bg-gradient-to-r from-rose-50 to-pink-50 text-pink-700 ring-1 ring-pink-200",
  "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 ring-1 ring-teal-200",
  "bg-gradient-to-r from-lime-50 to-emerald-50 text-lime-700 ring-1 ring-lime-200",
  "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 ring-1 ring-yellow-200",
  "bg-gradient-to-r from-red-50 to-rose-50 text-rose-700 ring-1 ring-rose-200",
  "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 ring-1 ring-purple-200",
  "bg-gradient-to-r from-pink-50 to-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200",
  "bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 ring-1 ring-orange-200",
  "bg-gradient-to-r from-slate-100 to-zinc-100 text-zinc-700 ring-1 ring-zinc-200",
  "bg-gradient-to-r from-stone-100 to-amber-50 text-stone-700 ring-1 ring-stone-200",
  "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  "bg-gradient-to-r from-sky-50 to-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
  "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 ring-1 ring-emerald-200",
  "bg-gradient-to-r from-fuchsia-50 to-rose-50 text-rose-700 ring-1 ring-fuchsia-200",
  "bg-gradient-to-r from-neutral-100 to-slate-100 text-slate-700 ring-1 ring-slate-300",
  "bg-gradient-to-r from-green-50 to-lime-50 text-green-700 ring-1 ring-green-200",
  "bg-gradient-to-r from-cyan-50 to-teal-50 text-teal-700 ring-1 ring-teal-200",
  "bg-gradient-to-r from-orange-50 to-amber-50 text-amber-700 ring-1 ring-amber-200",
  "bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 ring-1 ring-violet-200",
  "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 ring-1 ring-pink-200",
];

function hashText(input: string) {
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    const codePoint = input.codePointAt(i) ?? 0;
    hash = Math.trunc(((hash << 5) - hash + codePoint) % 2147483647);
  }

  return Math.abs(hash);
}

function getOrgBadge(postName: string) {
  const label = postName.trim() || "JOB";
  const style = badgeStyles[hashText(label) % badgeStyles.length];
  return { label, style };
}

function parseDateSafe(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.toLowerCase() === "null") return null;

  // JSON API format: yyyy-mm-dd
  const yyyyMmDd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const ymdMatch = yyyyMmDd.exec(trimmed);
  if (ymdMatch) {
    const year = Number.parseInt(ymdMatch[1], 10);
    const month = Number.parseInt(ymdMatch[2], 10);
    const day = Number.parseInt(ymdMatch[3], 10);
    const normalized = new Date(year, month - 1, day);

    if (
      Number.isNaN(normalized.getTime()) ||
      normalized.getFullYear() !== year ||
      normalized.getMonth() !== month - 1 ||
      normalized.getDate() !== day
    ) {
      return null;
    }

    return normalized;
  }

  // Support dd-mm-yyyy and dd/mm/yyyy if data source changes format.
  const ddMmYyyy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const dmyMatch = ddMmYyyy.exec(trimmed);
  if (dmyMatch) {
    const day = Number.parseInt(dmyMatch[1], 10);
    const month = Number.parseInt(dmyMatch[2], 10);
    const year = Number.parseInt(dmyMatch[3], 10);
    const normalized = new Date(year, month - 1, day);

    if (
      Number.isNaN(normalized.getTime()) ||
      normalized.getFullYear() !== year ||
      normalized.getMonth() !== month - 1 ||
      normalized.getDate() !== day
    ) {
      return null;
    }

    return normalized;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

function formatDateDdMmYyyy(value: string) {
  const parsed = parseDateSafe(value);
  if (!parsed) return value;

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}-${month}-${year}`;
}

function getDateOnly(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysLeftFromLastDate(startDate: string, lastDate: string) {
  const start = parseDateSafe(startDate);
  const end = parseDateSafe(lastDate);

  // If lastDate is null/empty/invalid -> To Be Announced
  if (!end) {
    return null;
  }

  // If startDate exists and is after lastDate, treat as invalid payload.
  if (start) {
    const startDateOnly = getDateOnly(start);
    const endDateOnlyFromStartCheck = getDateOnly(end);
    if (startDateOnly.getTime() > endDateOnlyFromStartCheck.getTime()) {
      return null;
    }
  }

  const today = getDateOnly(new Date());
  const startDateOnly = start ? getDateOnly(start) : null;
  const endDateOnly = getDateOnly(end);

  if (startDateOnly) {
    const windowDays = Math.ceil((endDateOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24));

    // Requested display behavior:
    // - upcoming window uses exclusive diff (22 -> 24 = 2)
    // - active window uses inclusive display (01 -> 16 = 16)
    if (today < startDateOnly) {
      return windowDays;
    }

    return windowDays + 1;
  }

  return Math.ceil((endDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getDeadlineChip(startDate: string, lastDate: string) {
  const days = getDaysLeftFromLastDate(startDate, lastDate);

  if (days === null) {
    return {
      text: "To Be Announced",
      style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    };
  }

  if (days < 0) {
    return {
      text: "Closed",
      style: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    };
  }

  if (days <= 7) {
    return {
      text: `${days}d left`,
      style: "bg-rose-200 text-rose-950 ring-1 ring-rose-400 animate-pulse",
    };
  }

  if (days <= 15) {
    return {
      text: `${days}d left`,
      style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    };
  }

  return {
    text: `${days}d left`,
    style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };
}

type HomeJobsExplorerProps = Readonly<{
  jobs: LatestJob[];
}>;

export default function HomeJobsExplorer({ jobs }: HomeJobsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState<QualificationFilter>("all");
  const [closingWeekOnly, setClosingWeekOnly] = useState(false);

  const indexedJobs = useMemo(() => {
    return jobs.map((job) => {
      const searchCorpus = [
        job.postName,
        job.badge,
        job.state,
        job.qualification,
        job.seats,
        job.startDate,
        job.lastDate,
        job.postedTime,
      ]
        .join(" ")
        .toLowerCase();

      return {
        job,
        searchCorpus,
        normalizedSearchCorpus: searchCorpus.replace(/[\s,.-]/g, ""),
      };
    });
  }, [jobs]);

  const badgeOptions = useMemo(() => {
    return Array.from(new Set(jobs.map((job) => job.badge))).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const normalizedQuery = query.replace(/[\s,.-]/g, "");
    const hasSearch = query.length > 0;
    const hasDirectFilters = badgeFilter !== "all" || stateFilter !== "all" || qualificationFilter !== "all";

    if (!hasSearch && !hasDirectFilters && !closingWeekOnly) {
      return jobs;
    }

    return indexedJobs
      .filter(({ job, searchCorpus, normalizedSearchCorpus }) => {
        if (badgeFilter !== "all" && job.badge !== badgeFilter) return false;
        if (stateFilter !== "all" && job.state !== stateFilter) return false;
        if (qualificationFilter !== "all" && job.qualification !== qualificationFilter) return false;

        if (closingWeekOnly) {
          const effectiveDaysLeft = getDaysLeftFromLastDate(job.startDate, job.lastDate);
          const matchesClosingWeek = effectiveDaysLeft !== null && effectiveDaysLeft >= 0 && effectiveDaysLeft <= 7;
          if (!matchesClosingWeek) return false;
        }

        if (hasSearch) {
          const matchesSearch =
            searchCorpus.includes(query) || normalizedSearchCorpus.includes(normalizedQuery);
          if (!matchesSearch) return false;
        }

        return true;
      })
      .map(({ job }) => job);
  }, [jobs, indexedJobs, searchTerm, badgeFilter, stateFilter, qualificationFilter, closingWeekOnly]);

  const closingThisWeekCount = useMemo(() => {
    return jobs.filter((job) => {
      const effectiveDaysLeft = getDaysLeftFromLastDate(job.startDate, job.lastDate);
      return effectiveDaysLeft !== null && effectiveDaysLeft >= 0 && effectiveDaysLeft <= 7;
    }).length;
  }, [jobs]);

  const hasActiveFilters =
    searchTerm.length > 0 ||
    badgeFilter !== "all" ||
    stateFilter !== "all" ||
    qualificationFilter !== "all" ||
    closingWeekOnly;

  const clearFilters = () => {
    setSearchTerm("");
    setBadgeFilter("all");
    setStateFilter("all");
    setQualificationFilter("all");
    setClosingWeekOnly(false);
  };

  return (
    <section>
      <div className="pointer-events-none absolute -top-20 -right-12 h-40 w-40 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-44 w-44 rounded-full bg-fuchsia-200/25 blur-3xl" />

      <div className="relative rounded-xl border border-slate-200/85 bg-white/85 px-2.5 py-2 shadow-[0_14px_34px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 backdrop-blur-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-700 shadow-sm">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">Latest Jobs</p>
              <span className="hidden rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-semibold text-sky-800 ring-1 ring-sky-200 lg:inline-flex">
                Trusted Opportunities with Clear Qualification and Deadline Information
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setClosingWeekOnly((prev) => !prev)}
            className={`w-full rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ring-1 shadow-sm transition-colors sm:w-auto ${
              closingWeekOnly
                ? "animate-pulse bg-red-900 text-white ring-red-950 shadow-[0_0_0_2px_rgba(127,29,29,0.35)]"
                : "animate-pulse bg-red-900 text-white ring-red-950"
            }`}
          >
            <span className="inline-flex items-center gap-1 text-white">
              Closing This Week: {closingThisWeekCount}
              <ChevronRight
                className={`size-3 transition-transform ${closingWeekOnly ? "translate-x-0.5" : "animate-bounce"}`}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_auto_auto_auto_auto]">
          <label className="group inline-flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-2 py-1.5 text-[10px] font-medium text-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.08)] focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
            <Search className="size-3.5 text-slate-400 transition-colors group-focus-within:text-sky-600" aria-hidden="true" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search post, badge, state, qualification, seats, dates"
              className="w-full bg-transparent text-[10px] font-medium text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </label>

          <label className="inline-flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-2 py-1.5 text-[10px] font-medium text-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.08)]">
            <Filter className="size-3.5 text-indigo-500" aria-hidden="true" />
            <select
              value={badgeFilter}
              onChange={(event) => setBadgeFilter(event.target.value)}
              className="bg-transparent text-[10px] font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Badges</option>
              {badgeOptions.map((badge) => (
                <option key={badge} value={badge}>
                  {badge}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-2 py-1.5 text-[10px] font-medium text-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.08)]">
            <MapPin className="size-3.5 text-emerald-500" aria-hidden="true" />
            <select
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value)}
              className="bg-transparent text-[10px] font-semibold text-slate-700 outline-none"
            >
              <option value="all">All India</option>
              {stateOptions.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-2 py-1.5 text-[10px] font-medium text-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.08)]">
            <GraduationCap className="size-3.5 text-violet-500" aria-hidden="true" />
            <select
              value={qualificationFilter}
              onChange={(event) => setQualificationFilter(event.target.value as QualificationFilter)}
              className="bg-transparent text-[10px] font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Qualification</option>
              {qualificationOptions.map((qualification) => (
                <option key={qualification} value={qualification}>
                  {qualification}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-end gap-1 sm:col-span-2 lg:col-span-1">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
              {filteredJobs.length} jobs
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:border-rose-200 hover:text-rose-600"
              >
                <X className="size-3" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <div className="pointer-events-none absolute inset-x-2 top-2 z-10 h-6 rounded-t-xl bg-gradient-to-b from-white via-white/75 to-transparent" />
        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 h-6 rounded-b-xl bg-gradient-to-t from-white via-white/75 to-transparent" />
        <div className="max-h-[68vh] overflow-y-auto pr-1 [scrollbar-gutter:stable] [scrollbar-color:#0284c7_#e2e8f0] sm:max-h-[72vh] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-200/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-cyan-400 [&::-webkit-scrollbar-thumb]:via-sky-500 [&::-webkit-scrollbar-thumb]:to-indigo-500 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-slate-100/90">
          <div className="grid grid-cols-1 gap-2 [content-visibility:auto] [contain-intrinsic-size:380px] md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job, index) => {
              const badge = getOrgBadge(job.badge);
              const deadlineChip = getDeadlineChip(job.startDate, job.lastDate);
              const hasLastDate = job.lastDate.trim().length > 0;
              const formattedStartDate = formatDateDdMmYyyy(job.startDate);
              const formattedLastDate = formatDateDdMmYyyy(job.lastDate);

              return (
                <article
                  key={`${job.href}-${index}`}
                  className="group space-y-1 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-[0_10px_22px_rgba(15,23,42,0.09),0_2px_6px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_20px_38px_rgba(2,132,199,0.16),0_8px_16px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] shadow-sm ${badge.style}`}>
                      {badge.label}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${deadlineChip.style}`}>{deadlineChip.text}</span>
                    </div>
                  </div>

                  <Link href={job.href} className="mt-1 flex items-start gap-1 text-slate-800 transition-colors">
                    <span className="mt-0.5 inline-flex size-4 items-center justify-center rounded bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 transition-colors group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-900">
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </span>
                    <span className="line-clamp-2 text-[11px] font-extrabold leading-4.5 transition-colors group-hover:text-blue-900">{job.postName}</span>
                  </Link>

                  <dl className="mt-1.5 grid grid-cols-3 gap-x-1.5 gap-y-1 text-[9px]">
                    <div className="inline-flex items-center gap-0.5 text-slate-700 whitespace-nowrap">
                      <dt className="inline-flex items-center gap-0.5 font-semibold text-slate-700">
                        <Users className="size-2.5" aria-hidden="true" /> Seat:
                      </dt>
                      <dd className="rounded bg-emerald-600 px-1 py-0.5 font-bold text-white">{job.seats}</dd>
                    </div>
                    <div className="inline-flex items-center gap-0.5 text-slate-700 whitespace-nowrap">
                      <dt className="inline-flex shrink-0 items-center gap-0.5 font-semibold text-slate-700">
                        <MapPin className="size-2.5" aria-hidden="true" /> State:
                      </dt>
                      <dd className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-800">{job.state}</dd>
                    </div>
                    <div className="inline-flex items-center justify-end gap-1">
                      <dt className="sr-only">Actions</dt>
                      <dd className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        className="inline-flex size-4.5 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm ring-1 ring-sky-300/70 transition-transform hover:scale-105"
                        aria-label={`Save ${job.postName}`}
                      >
                        <Bookmark className="size-2.5" aria-hidden="true" />
                      </button>
                      </dd>
                    </div>
                    <div className="col-span-1 inline-flex min-w-0 items-center gap-1 text-slate-700 whitespace-nowrap">
                      <dt className="inline-flex shrink-0 items-center gap-1 font-semibold text-slate-700">
                        <CalendarClock className="size-2.5" aria-hidden="true" /> Start:
                      </dt>
                      <dd className="rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-800">{formattedStartDate}</dd>
                    </div>
                    <div className="col-span-2 inline-flex items-center justify-end gap-1">
                      <dt className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <CalendarRange className="size-2.5" aria-hidden="true" /> Last:
                      </dt>
                      <dd className={`rounded-md px-1.5 py-0.5 text-right font-semibold ${hasLastDate ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {hasLastDate ? formattedLastDate : "To Be Announced"}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-700">No jobs found for selected filters</p>
                <p className="mt-1 text-xs text-slate-500">Try clearing filters or changing search keywords.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
