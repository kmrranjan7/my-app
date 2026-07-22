"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Bell, CircleDot, X } from "lucide-react";
import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";

type NavItem = {
  label: string;
  href: string;
};

type SavedJobRecord = Readonly<{
  key: string;
  title: string;
  href: string;
  badge?: string;
  dateLabel?: string;
  savedAt: number;
}>;

type LatestUpdateRecord = Readonly<{
  id: string;
  title: string;
  time: string;
  type: string;
  href: string;
}>;

const SAVED_JOBS_STORAGE_KEY = "saved-jobs-records";
const PAGE_SIZE = 10;
const LATEST_UPDATES_API_URL = `${API_PUBLIC_BASE_URL}/latest-update?postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

function getBadgeStyles(type: string): string {
  const normalized = type.toLowerCase();
  
  if (normalized.includes("admit")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  
  if (normalized.includes("result")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  
  if (normalized.includes("exam")) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  
  if (normalized.includes("answer")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  
  if (normalized.includes("syllabus")) {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }
  
  if (normalized.includes("job")) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  
  // Default colors based on text hash for consistency
  const hash = Array.from(normalized).reduce((acc, char) => acc + (char.codePointAt(0) ?? 0), 0);
  const colors = [
    "border-purple-200 bg-purple-50 text-purple-700",
    "border-pink-200 bg-pink-50 text-pink-700",
    "border-orange-200 bg-orange-50 text-orange-700",
    "border-indigo-200 bg-indigo-50 text-indigo-700",
  ];
  
  return colors[hash % colors.length];
}


const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Latest Jobs", href: "/latest-jobs" },
  { label: "Results", href: "/results" },
  { label: "Admit Cards", href: "/admit-cards" },
  { label: "Exams", href: "/exams" },
  { label: "Image Compressor", href: "/image-compress" },
  { label: "Answer Keys", href: "/answer-keys" },
];

const moreItems: NavItem[] = [
  { label: "Syllabus", href: "/syllabus" },
  { label: "Admissions", href: "/admissions" },
  
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function HeaderNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>([]);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isSavedBellRinging, setIsSavedBellRinging] = useState(false);
  const [latestUpdates, setLatestUpdates] = useState<LatestUpdateRecord[]>([]);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const bellMenuRef = useRef<HTMLDivElement | null>(null);
  const updatesMenuRef = useRef<HTMLDivElement | null>(null);

  const handleClearAllSavedJobs = () => {
    if (typeof globalThis === "undefined") {
      return;
    }

    globalThis.localStorage?.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify([]));
    globalThis.localStorage?.setItem("saved-jobs-count", "0");

    setSavedJobs([]);
    setSavedJobsCount(0);

    globalThis.dispatchEvent(
      new CustomEvent("saved-jobs-count-changed", {
        detail: { count: 0, increased: false, records: [] },
      }),
    );
  };

  const handleDeleteSavedJob = (jobKey: string) => {
    if (typeof globalThis === "undefined") {
      return;
    }

    const nextRecords = savedJobs.filter((job) => job.key !== jobKey);

    globalThis.localStorage?.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(nextRecords));
    globalThis.localStorage?.setItem("saved-jobs-count", String(nextRecords.length));

    setSavedJobs(nextRecords);
    setSavedJobsCount(nextRecords.length);

    globalThis.dispatchEvent(
      new CustomEvent("saved-jobs-count-changed", {
        detail: { count: nextRecords.length, increased: false, records: nextRecords },
      }),
    );
  };

  const hideHeader =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(globalThis.scrollY > 8);
    };

    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setIsMoreOpen(false);
      }

      if (bellMenuRef.current && !bellMenuRef.current.contains(target)) {
        setIsBellOpen(false);
      }

      if (updatesMenuRef.current && !updatesMenuRef.current.contains(target)) {
        setIsUpdatesOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
        setIsBellOpen(false);
        setIsUpdatesOpen(false);
      }
    };

    globalThis.addEventListener("mousedown", onPointerDown);
    globalThis.addEventListener("keydown", onEscape);

    return () => {
      globalThis.removeEventListener("mousedown", onPointerDown);
      globalThis.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    setIsMoreOpen(false);
    setIsBellOpen(false);
    setIsUpdatesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      if (!isUpdatesOpen || latestUpdates.length > 0) return;
      
      setIsLoadingUpdates(true);
      try {
        const response = await fetch(`${LATEST_UPDATES_API_URL}&page=0`, {
          method: "GET",
        });
        
        if (response.ok) {
          const data = await response.json();
          const content = data.data?.content || [];
          
          const updates: LatestUpdateRecord[] = content.map((item: any, index: number) => ({
            id: item.postSlug || `update-${index}`,
            title: item.postTitle || "Untitled Update",
            time: item.startDate || "",
            type: item.postType || "Update",
            href: item.postSlug ? `/${item.postSlug}` : "/updates",
          }));
          
          setLatestUpdates(updates);
        }
      } catch (error) {
        console.error("Failed to fetch latest updates:", error);
      } finally {
        setIsLoadingUpdates(false);
      }
    };

    fetchLatestUpdates();
  }, [isUpdatesOpen, latestUpdates.length]);

  useEffect(() => {
    const readSavedCount = () => {
      const rawCount = globalThis.localStorage?.getItem("saved-jobs-count");
      const parsed = Number(rawCount ?? 0);
      setSavedJobsCount(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
    };

    const readSavedJobs = () => {
      const raw = globalThis.localStorage?.getItem(SAVED_JOBS_STORAGE_KEY);

      if (!raw) {
        setSavedJobs([]);
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

        setSavedJobs(safeRecords);
      } catch {
        setSavedJobs([]);
      }
    };

    const onSavedCountChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{
        count?: number;
        increased?: boolean;
        records?: SavedJobRecord[];
      }>;
      const nextCount = Number(customEvent.detail?.count ?? 0);

      setSavedJobsCount(Number.isFinite(nextCount) && nextCount >= 0 ? nextCount : 0);

      const records = customEvent.detail?.records;
      if (Array.isArray(records)) {
        setSavedJobs(records);
      } else {
        readSavedJobs();
      }

      if (customEvent.detail?.increased) {
        setIsSavedBellRinging(true);
        globalThis.setTimeout(() => {
          setIsSavedBellRinging(false);
        }, 850);
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === "saved-jobs-count") {
        readSavedCount();
      }

      if (event.key === SAVED_JOBS_STORAGE_KEY) {
        readSavedJobs();
      }
    };

    readSavedCount();
    readSavedJobs();
    globalThis.addEventListener("saved-jobs-count-changed", onSavedCountChanged as EventListener);
    globalThis.addEventListener("storage", onStorage);

    return () => {
      globalThis.removeEventListener("saved-jobs-count-changed", onSavedCountChanged as EventListener);
      globalThis.removeEventListener("storage", onStorage);
    };
  }, []);

  if (hideHeader) {
    return null;
  }

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b border-[#2563EB]/30 bg-white/90 backdrop-blur-xl transition-all duration-300",
          isScrolled
            ? "shadow-[0_14px_36px_rgba(2,6,23,0.14)]"
            : "shadow-[0_6px_18px_rgba(2,6,23,0.08)]",
        ].join(" ")}
      >
        <div className="w-full px-2 sm:px-3 lg:px-4">
          <div className="pointer-events-none hidden h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#2563EB]/80 to-transparent lg:block" />

          <div className="grid h-11 grid-cols-[1fr_auto] items-center gap-1.5 lg:h-[52px] lg:grid-cols-[auto_1fr_auto] lg:gap-3">
            <div className="inline-flex min-w-0 items-center gap-1.5 lg:gap-2">
              <Link
                href="/"
                className="group inline-flex min-w-0 items-center gap-1.5 rounded-xl px-1 py-0.5 text-[13px] font-extrabold tracking-tight text-slate-900 transition-all duration-300 hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 lg:px-1.5"
                aria-label="Sarkari Global Result home"
              >
                <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#2563EB]/30 bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] text-[10px] font-black text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_58%)]" />
                  <span className="relative">SGR</span>
                </span>
                <span className="flex min-w-0 flex-col leading-none">
                  <span className="truncate text-[14px] font-black tracking-tight text-slate-900 lg:text-[15px]">
                    Sarkari Global Result
                  </span>
                  <span className="hidden truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2563EB] lg:block">
                    Government Career Desk
                  </span>
                </span>
              </Link>

              <div className="hidden items-center justify-end gap-1.5 lg:flex">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700 shadow-[0_6px_14px_rgba(5,150,105,0.16)] motion-safe:animate-pulse">
                  <span className="relative inline-flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <span>Live Updates</span>
                </span>
              </div>
            </div>

            <nav
              className="hidden min-w-0 items-center justify-end gap-1.5 overflow-visible whitespace-nowrap lg:flex"
              aria-label="Primary"
            >
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45",
                      active
                        ? "border-[#2563EB]/25 bg-gradient-to-b from-[#eff6ff] to-[#dbeafe] text-[#1d4ed8] shadow-[0_8px_20px_rgba(37,99,235,0.22)]"
                        : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}


              <div ref={moreMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] text-slate-700 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45"
                  aria-haspopup="menu"
                  aria-expanded={isMoreOpen}
                  aria-controls="header-more-menu"
                  aria-label="More pages"
                >
                  <span>More</span>
                  <span aria-hidden="true">▾</span>
                </button>

                <div
                  id="header-more-menu"
                  className={[
                    "absolute right-0 top-[calc(100%+6px)] z-20 min-w-[180px] rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_14px_30px_rgba(2,6,23,0.16)] backdrop-blur-md transition-all duration-200",
                    isMoreOpen
                      ? "pointer-events-auto visible opacity-100"
                      : "pointer-events-none invisible opacity-0",
                  ].join(" ")}
                >
                  <div className="space-y-0.5">
                    <div className="space-y-0.5">
                      <p className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Quick Links
                      </p>
                      {moreItems.slice(0, 4).map((item) => {
                        const active = isActive(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={[
                              "block rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors duration-200",
                              active
                                ? "bg-[#eff6ff] text-[#1d4ed8]"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                            ].join(" ")}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-200/70 pt-0.5 space-y-0.5">
                      <p className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Pages
                      </p>
                      {moreItems.slice(4).map((item) => {
                        const active = isActive(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={[
                              "block rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors duration-200",
                              active
                                ? "bg-[#eff6ff] text-[#1d4ed8]"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                            ].join(" ")}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </nav>

            <div className="flex items-center gap-1.5">
              <div ref={updatesMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdatesOpen((prev) => !prev);
                  }}
                  className="relative inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-1.5 text-blue-600 transition-transform hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  aria-live="polite"
                  aria-label="Latest updates"
                  title="Latest updates"
                  aria-haspopup="menu"
                  aria-expanded={isUpdatesOpen}
                  aria-controls="updates-menu"
                >
                  <Bell className="size-3.5" aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                </button>

                <div
                  id="updates-menu"
                  className={[
                    "absolute right-0 top-[calc(100%+8px)] z-20 w-[320px] rounded-2xl border border-blue-200/80 bg-white/95 p-1.5 shadow-[0_16px_34px_rgba(2,6,23,0.16)] backdrop-blur-md transition-all duration-200",
                    isUpdatesOpen
                      ? "pointer-events-auto visible opacity-100"
                      : "pointer-events-none invisible opacity-0",
                  ].join(" ")}
                  role="menu"
                  aria-label="Latest updates"
                >
                  <div className="mb-1 flex items-center justify-between gap-2 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-700">
                      Latest Updates
                    </p>
                  </div>

                  <div className="max-h-72 space-y-1 overflow-y-auto pr-0.5">
                    {isLoadingUpdates && (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-2 py-6 text-center text-[11px] text-slate-500">
                        Loading updates...
                      </div>
                    )}
                    
                    {!isLoadingUpdates && latestUpdates.length === 0 && (
                      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-2 py-3 text-[11px] text-slate-500">
                        No updates available.
                      </p>
                    )}
                    
                    {!isLoadingUpdates && latestUpdates.length > 0 && latestUpdates.map((update) => (
                        <article
                          key={update.id}
                          className="group rounded-lg border border-slate-200/70 bg-white px-2.5 py-2 transition-all hover:border-slate-300 hover:shadow-sm"
                        >
                          <Link
                            href={update.href}
                            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-slate-800 group-hover:text-slate-900">
                                  {update.title}
                                </p>
                                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                  {(() => {
                                    if (!update.time) return "Date TBA";
                                    const date = new Date(update.time);
                                    if (Number.isNaN(date.getTime())) return "Date TBA";
                                    const day = String(date.getDate()).padStart(2, "0");
                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                    const year = date.getFullYear();
                                    return `${day}-${month}-${year}`;
                                  })()}
                                </p>
                              </div>
                              <span className={`inline-flex shrink-0 items-center rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${getBadgeStyles(update.type)}`}>
                                {update.type}
                              </span>
                            </div>
                          </Link>
                        </article>
                      ))
                    }
                  </div>
                </div>
              </div>

              <div ref={bellMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsBellOpen((prev) => !prev);
                }}
                className={`relative inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-1.5 text-rose-500 transition-transform hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
                  isSavedBellRinging ? "animate-bounce" : ""
                }`}
                aria-live="polite"
                aria-label={`Saved jobs ${savedJobsCount}`}
                title={`Saved jobs: ${savedJobsCount}`}
                aria-haspopup="menu"
                aria-expanded={isBellOpen}
                aria-controls="saved-jobs-menu"
              >
                <Heart className="size-3.5 fill-rose-500 text-rose-500" aria-hidden="true" />
                {savedJobsCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[14px] items-center justify-center rounded-full bg-rose-600 px-0.5 text-[8px] font-bold leading-[14px] text-white">
                    {savedJobsCount}
                  </span>
                ) : null}
              </button>

              <div
                id="saved-jobs-menu"
                className={[
                  "absolute right-0 top-[calc(100%+8px)] z-20 w-[290px] rounded-2xl border border-rose-200/80 bg-white/95 p-1.5 shadow-[0_16px_34px_rgba(2,6,23,0.16)] backdrop-blur-md transition-all duration-200",
                  isBellOpen
                    ? "pointer-events-auto visible opacity-100"
                    : "pointer-events-none invisible opacity-0",
                ].join(" ")}
                role="menu"
                aria-label="Saved job notifications"
              >
                <div className="mb-1 flex items-center justify-between gap-2 px-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-700">
                    Saved Jobs ({savedJobs.length})
                  </p>
                  <button
                    type="button"
                    onClick={handleClearAllSavedJobs}
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-72 space-y-1 overflow-y-auto pr-0.5">
                  {savedJobs.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-2 py-3 text-[11px] text-slate-500">
                      No saved jobs yet.
                    </p>
                  ) : (
                    savedJobs.map((job) => (
                      <article
                        key={job.key}
                        className="group rounded-xl border border-rose-100/80 bg-white px-1.5 py-1.5 transition-colors hover:border-rose-200 hover:bg-rose-50/40"
                      >
                        
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-start gap-1.5">
                            <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                              <CircleDot className="h-2.5 w-2.5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <Link
                                href={job.href}
                                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                              >
                                <p className="line-clamp-1 text-[11px] font-semibold leading-4 text-slate-800 group-hover:text-rose-800">
                                  {job.title}
                                </p>
                                <p className="text-[10px] leading-4 text-slate-500">
                                  {job.dateLabel || (() => {
                                    const date = new Date(job.savedAt);
                                    const day = String(date.getDate()).padStart(2, "0");
                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                    const year = date.getFullYear();
                                    return `${day}-${month}-${year}`;
                                  })()}
                                </p>
                              </Link>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteSavedJob(job.key);
                            }}
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                            aria-label={`Delete saved job ${job.title}`}
                            title="Delete"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
              </div>
            </div>

          </div>
        </div>
      </header>
      <div className="h-11 lg:h-[52px]" aria-hidden="true" />
    </>
  );
}