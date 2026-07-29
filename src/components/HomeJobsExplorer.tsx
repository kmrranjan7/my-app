"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  GraduationCap,
  Search,
  MapPin,
  Sparkles,
  X,
  Heart,
} from "lucide-react";
import type { LatestJob } from "@/data/sidebarContent";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";
import { parseDateSafe, toDateOnly } from "@/lib/dateStatus";
import { useInfinitePagedFeed } from "@/hooks/useInfinitePagedFeed";
import ShareActionButton from "@/components/common/ShareActionButton";

const PAGE_SIZE = 20;
const PUBLIC_FEED_REVALIDATE_SECONDS = 60;

type JobsApiContentItem = Readonly<{
  readonly applicationId?: string;
  readonly createdAt?: string;
  readonly isFeatured?: boolean;
  readonly organization?: string;
  readonly qualification?: string;
  readonly priorityScore?: number;
  readonly postSlug?: string;
  readonly postTitle?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly stateName?: string;
  readonly vacancies?: number;
}>;

type JobsApiResponse = Readonly<{
  readonly data?: {
    readonly content?: JobsApiContentItem[];
  };
}>;

const HOME_JOBS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Job&postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;
const STATE_FILTER_JOBS_API_URL = `${API_PUBLIC_BASE_URL}/jobs?postType=Job&postStatus=Published&sortBy=createdAt&sortDir=desc`;

function mapApiJobToExplorerJob(item: JobsApiContentItem): LatestJob {
  const qualification = item.qualification?.trim() || "Not Specified";

  return {
    badge: item.organization || item.applicationId || "JOB",
    postName: item.postTitle || "Untitled Job",
    qualification,
    seats:
      typeof item.vacancies === "number" && Number.isFinite(item.vacancies)
        ? item.vacancies.toLocaleString("en-IN")
        : "N/A",
    state: item.stateName || "All India",
    startDate: item.startDate || "",
    lastDate: item.endDate || "",
    href: item.postSlug || "",
    isFeatured: item.isFeatured === true,
    priorityScore:
      typeof item.priorityScore === "number" && Number.isFinite(item.priorityScore)
        ? item.priorityScore
        : 0,
    createdAt: item.createdAt,
  };
}

function toTimestamp(value?: string): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function compareJobsByRanking(a: LatestJob, b: LatestJob): number {
  const featuredDiff = Number(b.isFeatured === true) - Number(a.isFeatured === true);
  if (featuredDiff !== 0) {
    return featuredDiff;
  }

  const aPriority = typeof a.priorityScore === "number" ? a.priorityScore : 0;
  const bPriority = typeof b.priorityScore === "number" ? b.priorityScore : 0;
  const priorityDiff = bPriority - aPriority;
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  return toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
}

async function fetchJobsPage(page: number): Promise<LatestJob[]> {
  try {
    const response = await fetch(`${HOME_JOBS_API_URL}&page=${page}`, {
      method: "GET",
      next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as JobsApiResponse;
    const content = payload.data?.content ?? [];
    return content.map(mapApiJobToExplorerJob);
  } catch {
    return [];
  }
}

const qualificationOptions = [
  "Below 10th Pass",
  "10th Pass",
  "12th Pass",
  "Graduate",
  "Post Graduate",
  "Diploma",
  
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

function getOrgBadge(postName: string, variantKey = "") {
  const label = postName.trim() || "JOB";
  const style = badgeStyles[hashText(`${label}-${variantKey}`) % badgeStyles.length];
  return { label, style };
}

function normalizeFilterValue(value: string): string {
  return value.trim().toLowerCase();
}

function formatDateDdMmYyyy(value: string) {
  const parsed = parseDateSafe(value);
  if (!parsed) return value;

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}-${month}-${year}`;
}

function getDaysLeftFromLastDate(startDate: string, lastDate: string) {
  const start = parseDateSafe(startDate);
  const end = parseDateSafe(lastDate);

  // Keep display days based on the start/end window from JSON payload.
  if (!start || !end) {
    return null;
  }

  const startDateOnly = toDateOnly(start);
  const endDateOnly = toDateOnly(end);

  // Invalid payload guard.
  if (startDateOnly.getTime() > endDateOnly.getTime()) {
    return null;
  }

  // After lastDate passes, card should show Closed.
  const today = toDateOnly(new Date());
  if (today.getTime() > endDateOnly.getTime()) {
    return -1;
  }

  return Math.ceil((endDateOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24));
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

type SavedJobRecord = Readonly<{
  key: string;
  title: string;
  href: string;
  badge?: string;
  dateLabel?: string;
  savedAt: number;
}>;

const SAVED_JOBS_STORAGE_KEY = "saved-jobs-records";

function getSavedJobKeys(records: readonly SavedJobRecord[]): string[] {
  return records.map((record) => record.key);
}

function areStringArraysEqual(current: readonly string[], next: readonly string[]): boolean {
  if (current.length !== next.length) {
    return false;
  }

  for (let i = 0; i < current.length; i += 1) {
    if (current[i] !== next[i]) {
      return false;
    }
  }

  return true;
}

function formatSavedJobDateLabel(job: LatestJob) {
  const primaryDate = parseDateSafe(job.lastDate) ?? parseDateSafe(job.startDate);
  const effectiveDate = primaryDate ?? new Date();

  const day = String(effectiveDate.getDate()).padStart(2, "0");
  const month = String(effectiveDate.getMonth() + 1).padStart(2, "0");
  const year = effectiveDate.getFullYear();

  return `${day}-${month}-${year}`;
}

export default function HomeJobsExplorer({ jobs }: HomeJobsExplorerProps) {
  const searchParams = useSearchParams();
  const requestedSearch = searchParams.get("search")?.trim() ?? "";
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState<QualificationFilter>("all");
  const [closingWeekOnly, setClosingWeekOnly] = useState(false);
  const [savedJobKeys, setSavedJobKeys] = useState<string[]>([]);
  const [savedJobRecords, setSavedJobRecords] = useState<SavedJobRecord[]>([]);
  const [dropdownScopedJobs, setDropdownScopedJobs] = useState<LatestJob[] | null>(null);
  const [isDropdownScopedLoading, setIsDropdownScopedLoading] = useState(false);
  const [searchFallbackJobs, setSearchFallbackJobs] = useState<LatestJob[] | null>(null);
  const [isSearchFallbackLoading, setIsSearchFallbackLoading] = useState(false);
  const previousSavedCountRef = useRef(0);
  const hasHydratedSavedJobsRef = useRef(false);

  useEffect(() => {
    setSearchTerm(requestedSearch);
  }, [requestedSearch]);

  const {
    items,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfinitePagedFeed<LatestJob>({
    initialItems: jobs,
    pageSize: PAGE_SIZE,
    fetchPage: fetchJobsPage,
    getKey: (job) => `${job.href}|${job.postName}|${job.startDate}|${job.lastDate}`,
  });

  const rankedItems = useMemo(() => {
    return [...items].sort(compareJobsByRanking);
  }, [items]);

  useEffect(() => {
    let isMounted = true;

    const selectedState = stateFilter === "all" ? "" : stateFilter.toLowerCase();
    const selectedQualification = qualificationFilter === "all" ? "" : qualificationFilter.toLowerCase();
    const searchTerms = [selectedState, selectedQualification].filter(Boolean);

    if (searchTerms.length === 0) {
      setDropdownScopedJobs(null);
      setIsDropdownScopedLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const hasLocalDropdownMatch = rankedItems.some((job) => {
      if (stateFilter !== "all") {
        const normalizedSelectedState = normalizeFilterValue(stateFilter);
        const normalizedJobState = normalizeFilterValue(job.state);

        if (!normalizedJobState.includes(normalizedSelectedState)) {
          return false;
        }
      }

      if (qualificationFilter !== "all") {
        const normalizedSelectedQualification = normalizeFilterValue(qualificationFilter);
        const normalizedJobQualification = normalizeFilterValue(job.qualification);

        if (!normalizedJobQualification.includes(normalizedSelectedQualification)) {
          return false;
        }
      }

      return true;
    });

    if (hasLocalDropdownMatch) {
      setDropdownScopedJobs(null);
      setIsDropdownScopedLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const fetchDropdownScopedJobs = async () => {
      setIsDropdownScopedLoading(true);
      setDropdownScopedJobs([]);

      try {
        const searchValue = searchTerms.join(" ");
        const response = await fetch(
          `${STATE_FILTER_JOBS_API_URL}&search=${encodeURIComponent(searchValue)}`,
          {
            method: "GET",
            next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
          },
        );

        if (!response.ok) {
          if (isMounted) {
            setDropdownScopedJobs([]);
          }
          return;
        }

        const payload = (await response.json()) as JobsApiResponse;
        const content = payload.data?.content ?? [];

        if (isMounted) {
          setDropdownScopedJobs(content.map(mapApiJobToExplorerJob));
        }
      } catch {
        if (isMounted) {
          setDropdownScopedJobs([]);
        }
      } finally {
        if (isMounted) {
          setIsDropdownScopedLoading(false);
        }
      }
    };

    void fetchDropdownScopedJobs();

    return () => {
      isMounted = false;
    };
  }, [rankedItems, stateFilter, qualificationFilter]);

  const isDropdownApiMode = dropdownScopedJobs !== null;

  const allJobs = useMemo(() => {
    const source = dropdownScopedJobs ?? rankedItems;
    return [...source].sort(compareJobsByRanking);
  }, [dropdownScopedJobs, rankedItems]);

  const indexedJobs = useMemo(() => {
    return allJobs.map((job) => {
      const searchCorpus = [
        job.postName,
        job.badge,
        job.state,
        job.qualification,
        job.seats,
        job.startDate,
        job.lastDate,
      ]
        .join(" ")
        .toLowerCase();

      return {
        job,
        searchCorpus,
        normalizedSearchCorpus: searchCorpus.replace(/[\s,.-]/g, ""),
      };
    });
  }, [allJobs]);

  useEffect(() => {
    let isMounted = true;

    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      setSearchFallbackJobs(null);
      setIsSearchFallbackLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const normalizedQuery = query.replace(/[\s,.-]/g, "");

    const hasLocalMatch = indexedJobs.some(({ job, searchCorpus, normalizedSearchCorpus }) => {
      if (stateFilter !== "all") {
        const normalizedSelectedState = normalizeFilterValue(stateFilter);
        const normalizedJobState = normalizeFilterValue(job.state);

        if (!normalizedJobState.includes(normalizedSelectedState)) {
          return false;
        }
      }

      if (qualificationFilter !== "all") {
        const normalizedSelectedQualification = normalizeFilterValue(qualificationFilter);
        const normalizedJobQualification = normalizeFilterValue(job.qualification);

        if (!normalizedJobQualification.includes(normalizedSelectedQualification)) {
          return false;
        }
      }

      if (closingWeekOnly) {
        const effectiveDaysLeft = getDaysLeftFromLastDate(job.startDate, job.lastDate);
        const matchesClosingWeek = effectiveDaysLeft !== null && effectiveDaysLeft >= 0 && effectiveDaysLeft <= 7;

        if (!matchesClosingWeek) {
          return false;
        }
      }

      return searchCorpus.includes(query) || normalizedSearchCorpus.includes(normalizedQuery);
    });

    if (hasLocalMatch) {
      setSearchFallbackJobs(null);
      setIsSearchFallbackLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const fetchSearchFallbackJobs = async () => {
      setIsSearchFallbackLoading(true);
      setSearchFallbackJobs([]);

      try {
        const response = await fetch(
          `${STATE_FILTER_JOBS_API_URL}&search=${encodeURIComponent(query)}`,
          {
            method: "GET",
            next: { revalidate: PUBLIC_FEED_REVALIDATE_SECONDS },
          },
        );

        if (!response.ok) {
          if (isMounted) {
            setSearchFallbackJobs([]);
          }
          return;
        }

        const payload = (await response.json()) as JobsApiResponse;
        const content = payload.data?.content ?? [];

        if (isMounted) {
          setSearchFallbackJobs(content.map(mapApiJobToExplorerJob));
        }
      } catch {
        if (isMounted) {
          setSearchFallbackJobs([]);
        }
      } finally {
        if (isMounted) {
          setIsSearchFallbackLoading(false);
        }
      }
    };

    void fetchSearchFallbackJobs();

    return () => {
      isMounted = false;
    };
  }, [closingWeekOnly, indexedJobs, qualificationFilter, searchTerm, stateFilter]);

  const activeJobs = searchFallbackJobs ?? allJobs;

  const indexedActiveJobs = useMemo(() => {
    return activeJobs.map((job) => {
      const searchCorpus = [
        job.postName,
        job.badge,
        job.state,
        job.qualification,
        job.seats,
        job.startDate,
        job.lastDate,
      ]
        .join(" ")
        .toLowerCase();

      return {
        job,
        searchCorpus,
        normalizedSearchCorpus: searchCorpus.replace(/[\s,.-]/g, ""),
      };
    });
  }, [activeJobs]);

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const normalizedQuery = query.replace(/[\s,.-]/g, "");
    const hasSearch = query.length > 0;
    const hasDirectFilters = stateFilter !== "all" || qualificationFilter !== "all";

    if (!hasSearch && !hasDirectFilters && !closingWeekOnly) {
      return activeJobs;
    }

    return indexedActiveJobs
      .filter(({ job, searchCorpus, normalizedSearchCorpus }) => {
        if (stateFilter !== "all") {
          const normalizedSelectedState = normalizeFilterValue(stateFilter);
          const normalizedJobState = normalizeFilterValue(job.state);

          if (!normalizedJobState.includes(normalizedSelectedState)) {
            return false;
          }
        }
        if (qualificationFilter !== "all") {
          const normalizedSelectedQualification = normalizeFilterValue(qualificationFilter);
          const normalizedJobQualification = normalizeFilterValue(job.qualification);

          if (!normalizedJobQualification.includes(normalizedSelectedQualification)) {
            return false;
          }
        }

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
  }, [activeJobs, indexedActiveJobs, searchTerm, stateFilter, qualificationFilter, closingWeekOnly]);

  const closingThisWeekCount = useMemo(() => {
    return allJobs.filter((job) => {
      const effectiveDaysLeft = getDaysLeftFromLastDate(job.startDate, job.lastDate);
      return effectiveDaysLeft !== null && effectiveDaysLeft >= 0 && effectiveDaysLeft <= 7;
    }).length;
  }, [allJobs]);

  const hasActiveFilters =
    searchTerm.length > 0 ||
    stateFilter !== "all" ||
    qualificationFilter !== "all" ||
    closingWeekOnly;

  const clearFilters = () => {
    setSearchTerm("");
    setStateFilter("all");
    setQualificationFilter("all");
    setClosingWeekOnly(false);
  };

  const handleStateFilterChange = (value: string) => {
    setStateFilter(value);
  };

  const handleQualificationFilterChange = (value: string) => {
    setQualificationFilter(value as QualificationFilter);
  };

  const toggleSavedJob = (jobKey: string, job: LatestJob) => {
    setSavedJobKeys((previous) => {
      if (previous.includes(jobKey)) {
        return previous.filter((key) => key !== jobKey);
      }

      return [...previous, jobKey];
    });

    setSavedJobRecords((previous) => {
      const exists = previous.some((record) => record.key === jobKey);
      if (exists) {
        return previous.filter((record) => record.key !== jobKey);
      }

      const href = job.href.startsWith("/") ? job.href : `/${job.href}`;
      return [
        {
          key: jobKey,
          title: job.postName,
          href,
          badge: job.badge,
          dateLabel: formatSavedJobDateLabel(job),
          savedAt: Date.now(),
        },
        ...previous,
      ];
    });
  };

  useEffect(() => {
    if (typeof globalThis === "undefined" || hasHydratedSavedJobsRef.current) {
      return;
    }

    const raw = globalThis.localStorage?.getItem(SAVED_JOBS_STORAGE_KEY);

    if (!raw) {
      previousSavedCountRef.current = 0;
      hasHydratedSavedJobsRef.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SavedJobRecord[];
      const safeRecords = Array.isArray(parsed)
        ? parsed.filter((record) => {
            return (
              typeof record?.key === "string" &&
              typeof record?.title === "string" &&
              typeof record?.href === "string" &&
              (record?.badge === undefined || typeof record?.badge === "string") &&
              (record?.dateLabel === undefined || typeof record?.dateLabel === "string") &&
              typeof record?.savedAt === "number"
            );
          })
        : [];

      setSavedJobRecords(safeRecords);
      setSavedJobKeys(safeRecords.map((record) => record.key));
      previousSavedCountRef.current = safeRecords.length;
    } catch {
      previousSavedCountRef.current = 0;
    }

    hasHydratedSavedJobsRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof globalThis === "undefined" || !hasHydratedSavedJobsRef.current) {
      return;
    }

    const uniqueRecords = savedJobRecords.filter((record, index, arr) => {
      return arr.findIndex((candidate) => candidate.key === record.key) === index;
    });

    globalThis.localStorage?.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(uniqueRecords));

    const nextCount = uniqueRecords.length;
    const increased = nextCount > previousSavedCountRef.current;

    globalThis.localStorage?.setItem("saved-jobs-count", String(nextCount));
    globalThis.dispatchEvent(
      new CustomEvent("saved-jobs-count-changed", {
        detail: { count: nextCount, increased, records: uniqueRecords },
      }),
    );

    previousSavedCountRef.current = nextCount;
  }, [savedJobRecords]);

  useEffect(() => {
    if (typeof globalThis === "undefined") {
      return;
    }

    const onSavedCountChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{
        count?: number;
        records?: SavedJobRecord[];
      }>;

      const count = Number(customEvent.detail?.count ?? 0);
      const records = customEvent.detail?.records;

      // When navbar Clear All is clicked, immediately reset all heart states.
      if (count === 0 && Array.isArray(records) && records.length === 0) {
        setSavedJobRecords((previous) => (previous.length === 0 ? previous : []));
        setSavedJobKeys((previous) => (previous.length === 0 ? previous : []));
        previousSavedCountRef.current = 0;
        return;
      }

      if (Array.isArray(records)) {
        const nextKeys = getSavedJobKeys(records);
        setSavedJobRecords((previous) => {
          const previousKeys = getSavedJobKeys(previous);
          return areStringArraysEqual(previousKeys, nextKeys) ? previous : records;
        });

        setSavedJobKeys((previous) => {
          return areStringArraysEqual(previous, nextKeys) ? previous : nextKeys;
        });

        previousSavedCountRef.current = nextKeys.length;
      }
    };

    globalThis.addEventListener("saved-jobs-count-changed", onSavedCountChanged as EventListener);

    return () => {
      globalThis.removeEventListener("saved-jobs-count-changed", onSavedCountChanged as EventListener);
    };
  }, []);

  return (
    <section className="relative block w-full min-w-0 max-w-full overflow-x-hidden">
      <div className="relative mx-0 w-full max-w-full overflow-hidden rounded-xl border border-indigo-100/90 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.72),transparent_38%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#eef8ff_100%)] p-2 shadow-[0_10px_24px_rgba(15,23,42,0.07)] ring-1 ring-indigo-50/80 backdrop-blur-sm sm:px-2.5 sm:py-2.5">
        <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex items-center gap-1.5">
            <span className="inline-flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-sm">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-cyan-700">Latest Jobs</p>
                <p className="mt-0.5 text-[11px] font-bold tracking-tight text-slate-900 sm:text-[12px]">Discover verified government opportunities and apply with confidence.</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setClosingWeekOnly((prev) => !prev)}
            className={`w-full max-w-full shrink-0 rounded-lg px-2 py-1 text-[9px] font-bold leading-4 tracking-normal ring-1 shadow-sm transition-all sm:w-auto ${
              closingWeekOnly
                ? "animate-pulse bg-gradient-to-r from-rose-700 to-red-700 text-white ring-rose-900 shadow-[0_0_0_2px_rgba(190,18,60,0.28)]"
                : "bg-gradient-to-r from-rose-600 to-red-600 text-white ring-rose-700"
            }`}
          >
            <span className="inline-flex min-w-0 flex-wrap items-center justify-center gap-1 text-white">
              Closing This Week: {closingThisWeekCount}
              <ChevronRight
                className={`size-3 transition-transform ${closingWeekOnly ? "translate-x-0.5" : "animate-bounce"}`}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(130px,0.55fr)_minmax(150px,0.6fr)_auto]">
          <label className="group inline-flex min-w-0 w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-2 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm transition-all focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-100 sm:col-span-2 lg:col-span-1">
            <Search className="size-3.5 text-slate-400 transition-colors group-focus-within:text-cyan-600" aria-hidden="true" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search jobs, organization, state..."
              className="min-w-0 w-full bg-transparent text-[12px] font-medium text-slate-700 placeholder:text-slate-400 outline-none"
              suppressHydrationWarning
            />
          </label>

          <label className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-emerald-100 bg-white/95 px-2 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm">
            <MapPin className="size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
            <select
              value={stateFilter}
              onChange={(event) => handleStateFilterChange(event.target.value)}
              onInput={(event) => handleStateFilterChange((event.target as HTMLSelectElement).value)}
              className="min-w-0 w-full bg-transparent text-[12px] font-medium text-slate-700 outline-none"
              suppressHydrationWarning
            >
              <option value="all">All India</option>
              {stateOptions.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </label>

          <label className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-violet-100 bg-white/95 px-2 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm">
            <GraduationCap className="size-3.5 shrink-0 text-violet-500" aria-hidden="true" />
            <select
              value={qualificationFilter}
              onChange={(event) => handleQualificationFilterChange(event.target.value)}
              onInput={(event) => handleQualificationFilterChange((event.target as HTMLSelectElement).value)}
              className="min-w-0 w-full bg-transparent text-[12px] font-medium text-slate-700 outline-none"
              suppressHydrationWarning
            >
              <option value="all">All Qualification</option>
              {qualificationOptions.map((qualification) => (
                <option key={qualification} value={qualification}>
                  {qualification}
                </option>
              ))}
            </select>
          </label>

          <div className="flex min-w-0 flex-wrap items-center justify-end gap-1 sm:col-span-2 lg:col-span-1 max-lg:gap-1.5">
            {/* <span className="rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-cyan-700 ring-1 ring-cyan-200 max-lg:rounded-lg max-lg:px-2.5 max-lg:py-1.5 max-lg:text-[10px] max-lg:font-bold">
              {filteredJobs.length} jobs
            </span> */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 max-lg:rounded-lg max-lg:px-2.5 max-lg:py-1.5 max-lg:text-[10px]"
              >
                <X className="size-3" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 w-full min-w-0">
        <div className="overflow-visible pr-0 lg:max-h-[82vh] lg:overflow-y-auto lg:pr-1 lg:[scrollbar-gutter:stable] lg:[scrollbar-color:#0284c7_#e2e8f0] lg:[&::-webkit-scrollbar]:w-2.5 lg:[&::-webkit-scrollbar-track]:rounded-full lg:[&::-webkit-scrollbar-track]:bg-slate-200/70 lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-gradient-to-b lg:[&::-webkit-scrollbar-thumb]:from-cyan-400 lg:[&::-webkit-scrollbar-thumb]:via-sky-500 lg:[&::-webkit-scrollbar-thumb]:to-indigo-500 lg:[&::-webkit-scrollbar-thumb]:border-2 lg:[&::-webkit-scrollbar-thumb]:border-slate-100/90">
          <div className="min-w-0 grid grid-cols-1 gap-2 px-0 min-[560px]:grid-cols-2 lg:gap-2.5 xl:grid-cols-3">
            {filteredJobs.map((job, index) => {
              const jobKey = `${job.href}-${job.postName}`;
              const deadlineChip = getDeadlineChip(job.startDate, job.lastDate);
              const hasLastDate = job.lastDate.trim().length > 0;
              const formattedStartDate = formatDateDdMmYyyy(job.startDate);
              const formattedLastDate = formatDateDdMmYyyy(job.lastDate);
              const isSaved = savedJobKeys.includes(jobKey);

              return (
                <article
                  key={`${job.href}-${index}`}
                  className="group flex min-w-0 flex-col rounded-lg border border-slate-200/90 bg-white p-2 shadow-sm transition-shadow hover:shadow-md sm:rounded-md sm:p-1.5"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="max-w-[58%] truncate rounded-full border border-cyan-200 bg-cyan-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-cyan-800 sm:max-w-[58%]">
                      {job.badge.trim() || "JOB"}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${deadlineChip.style}`}>{deadlineChip.text}</span>
                    </div>
                  </div>

                  <Link href={job.href} className="mt-1 block text-[11px] font-bold leading-3.5 text-slate-900 transition-colors hover:text-cyan-800 sm:text-[12px]">
                    {job.postName}
                  </Link>

                  <div className="mt-1 grid grid-cols-2 gap-x-1.5 gap-y-0.5 border-t border-slate-100 pt-1 text-[8px] leading-3 text-slate-600 sm:text-[9px]">
                    <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">State</span><span className="line-clamp-1 font-semibold text-slate-700">{job.state}</span></p>
                    <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">Seats</span><span className="line-clamp-1 font-bold text-emerald-700">{job.seats}</span></p>
                    <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">Starts</span><span className="line-clamp-1 font-semibold text-slate-700">{formattedStartDate}</span></p>
                    <div className="flex min-w-0 items-end justify-between gap-1">
                      <p className="min-w-0"><span className="block font-bold uppercase tracking-wide text-slate-400">Last date</span><span className="line-clamp-1 font-bold text-rose-700">{hasLastDate ? formattedLastDate : "To Be Announced"}</span></p>
                      <div className="flex shrink-0 items-center gap-1">
                        <ShareActionButton
                          title={job.postName}
                          href={job.href}
                          contextLabel="Job Alert"
                          details={[
                            { label: "Organization", value: job.badge },
                            { label: "State", value: job.state },
                            { label: "Qualification", value: job.qualification },
                            { label: "Seats", value: job.seats },
                            { label: "Start Date", value: formattedStartDate },
                            { label: "Last Date", value: hasLastDate ? formattedLastDate : "To Be Announced" },
                          ]}
                          showLabel={false}
                          buttonClassName="inline-flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800 sm:size-5"
                          iconClassName="size-3 sm:size-2.5"
                          copiedTextClassName="mt-0.5 text-[9px] font-semibold text-emerald-700"
                        />
                        <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
                        <button
                          type="button"
                          onClick={() => toggleSavedJob(jobKey, job)}
                          className={[
                            "inline-flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors active:scale-[0.98] sm:size-5",
                            isSaved
                              ? "border-rose-300 bg-rose-50/90 text-rose-600"
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-100",
                          ].join(" ")}
                          aria-label={isSaved ? `Unsave ${job.postName}` : `Save ${job.postName}`}
                        >
                          <Heart className={isSaved ? "size-3 fill-current sm:size-2.5" : "size-3 sm:size-2.5"} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-cyan-200 bg-cyan-50/40 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-700">No jobs found for selected filters</p>
                <p className="mt-1 text-xs text-slate-500">Try clearing filters or changing search keywords.</p>
              </div>
            )}

            {!isDropdownApiMode ? <div ref={sentinelRef} className="col-span-full h-2" aria-hidden="true" /> : null}

            {isDropdownApiMode && isDropdownScopedLoading ? (
              <div className="col-span-full rounded-lg border border-cyan-100 bg-cyan-50/60 px-3 py-2 text-center text-[11px] font-semibold text-cyan-800">
                Loading filtered jobs...
              </div>
            ) : null}

            {!isDropdownScopedLoading && isSearchFallbackLoading ? (
              <div className="col-span-full rounded-lg border border-cyan-100 bg-cyan-50/60 px-3 py-2 text-center text-[11px] font-semibold text-cyan-800">
                No local match found. Searching more jobs...
              </div>
            ) : null}

            {!isDropdownApiMode && isLoadingMore && (
              <div className="col-span-full rounded-lg border border-cyan-100 bg-cyan-50/60 px-3 py-2 text-center text-[11px] font-semibold text-cyan-800">
                Loading 20 more jobs...
              </div>
            )}

            {!isDropdownApiMode && !hasMore && allJobs.length > 0 && (
              <div className="col-span-full text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                You have reached the latest available jobs.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
