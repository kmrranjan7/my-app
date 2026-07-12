"use client";

import { useMemo } from "react";
import {
  BadgeCheck,
  BellRing,
  BookOpenCheck,
  FolderOpen,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  PenSquare,
  Trophy,
  Shield,
  UserCog,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "Dashboard" },
  { icon: BellRing, label: "Job Notifications", key: "Job Notifications" },
  { icon: ClipboardList, label: "Current Vacancies", key: "Current Vacancies" },
  { icon: FolderOpen, label: "Saved Jobs", key: "Saved Jobs" },
  { icon: BadgeCheck, label: "Saved Admit Card", key: "Saved Admit Card" },
  { icon: BookOpenCheck, label: "Saved Exam", key: "Saved Exam" },
  { icon: Trophy, label: "Saved Result", key: "Saved Result" },
  { icon: UserCog, label: "Profile Management", key: "Profile Management" },
  { icon: PenSquare, label: "New Post", key: "New Post" },
  { icon: HelpCircle, label: "Help & Support", key: "Help & Support" },
] as const;

type DashboardSidebarProps = Readonly<{
  readonly activeKey?: string;
  readonly onSelectKey?: (key: string) => void;
}>;

export default function DashboardSidebar({
  activeKey = "Dashboard",
  onSelectKey,
}: DashboardSidebarProps) {
  const featureCount = navItems.length;

  const itemElements = useMemo(
    () =>
      navItems.map((item) => {
        const active = item.key === activeKey;

        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => {
                onSelectKey?.(item.key);
              }}
              className={[
                "group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition",
                active
                  ? "border-blue-300 bg-blue-50 text-blue-800 shadow-[0_8px_20px_rgba(37,99,235,0.14)] dark:border-blue-900 dark:bg-blue-950/35 dark:text-blue-200"
                  : "border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/70",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <item.icon
                size={16}
                className="text-slate-500 group-hover:text-blue-700 dark:text-slate-400"
                aria-hidden="true"
              />
              {item.label}
            </button>
          </li>
        );
      }),
    [activeKey, onSelectKey],
  );

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_8px_28px_rgba(2,6,23,0.06)] xl:sticky xl:top-20 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
        <span className="inline-flex items-center gap-2">
          <Shield size={16} aria-hidden="true" />
          Citizen Services
        </span>
        <span className="rounded-full border border-emerald-400/70 bg-white/80 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          {featureCount} features
        </span>
      </div>
      <ul className="space-y-1">{itemElements}</ul>
    </aside>
  );
}
