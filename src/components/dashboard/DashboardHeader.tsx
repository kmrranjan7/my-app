"use client";

import { Bell, LogOut, Search, ShieldCheck, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DashboardHeaderProps = Readonly<{
  readonly query: string;
  readonly language: "EN" | "HI";
  readonly unreadCount: number;
  readonly onQueryChange: (query: string) => void;
  readonly onLanguageChange: (language: "EN" | "HI") => void;
}>;

export default function DashboardHeader(props: DashboardHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b-2 border-blue-600/70 bg-white/92 backdrop-blur-xl transition-all duration-300 dark:border-blue-900 dark:bg-slate-950/92",
        isScrolled
          ? "shadow-[0_10px_30px_rgba(2,6,23,0.12)]"
          : "shadow-[0_4px_16px_rgba(2,6,23,0.06)]",
      ].join(" ")}
    >
      <div className="w-full px-0">
        <div className="grid min-h-14 grid-cols-1 items-center gap-2 py-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-2.5 sm:py-0">
          <div className="inline-flex items-center gap-2 rounded-md px-1 py-1 text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-blue-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">
              <ShieldCheck size={16} aria-hidden="true" />
            </span>
            <span className="truncate text-sm font-extrabold tracking-tight sm:text-[15px]">
              Recruitment Dashboard
            </span>
          </div>

          <label className="relative block min-w-0">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={props.query}
              onChange={(event) => props.onQueryChange(event.target.value)}
              placeholder="Search jobs, departments, application IDs"
              className="h-9 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label="Search jobs"
            />
          </label>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label="Notifications"
            >
              <Bell size={17} aria-hidden="true" />
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {props.unreadCount}
              </span>
            </button>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label="User profile"
            >
              <UserCircle2 size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                void handleLogout();
              }}
              disabled={isLoggingOut}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-rose-300 bg-white px-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
            >
              <LogOut size={15} aria-hidden="true" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>

            <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => props.onLanguageChange("EN")}
                className={[
                  "rounded-lg px-2 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                  props.language === "EN"
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")}
                aria-pressed={props.language === "EN"}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => props.onLanguageChange("HI")}
                className={[
                  "rounded-lg px-2 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                  props.language === "HI"
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")}
                aria-pressed={props.language === "HI"}
              >
                HI
              </button>
              <span className="sr-only">Current language: {props.language}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
