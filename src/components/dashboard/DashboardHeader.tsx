"use client";

import { LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DashboardHeaderProps = Readonly<{
  readonly dashboardUsername: string;
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
        "sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/92",
        isScrolled
          ? "shadow-[0_10px_30px_rgba(2,6,23,0.12)]"
          : "shadow-[0_4px_16px_rgba(2,6,23,0.06)]",
      ].join(" ")}
    >
      <div className="w-full px-0">
        <div className="grid min-h-14 grid-cols-1 items-center gap-2 py-2 sm:grid-cols-[auto_1fr_auto] sm:gap-2.5 sm:py-0">
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/85 px-2.5 py-1.5 text-slate-900 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 text-[11px] font-black tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(14,116,144,0.35)]">
              SGS
              <span className="absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/60 bg-slate-950 text-white dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900">
                <ShieldCheck size={10} aria-hidden="true" />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold tracking-tight sm:text-[15px]">
                SGS Recruitment Dashboard
              </span>
              <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Secure Talent Command
              </span>
            </span>
          </div>

          <div aria-hidden="true" className="hidden sm:block" />

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-300 bg-white px-2.5 text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label="User profile"
            >
              <UserCircle2 size={18} aria-hidden="true" />
              <span className="max-w-[130px] truncate text-xs font-semibold">
                {props.dashboardUsername}
              </span>
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
          </div>
        </div>
      </div>
    </header>
  );
}
