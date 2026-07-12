import { Activity, CheckCircle2, ClipboardCheck, FileClock, FileText, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

import { Card } from "@/components/dashboard/ui";
import type { DashboardStat } from "@/types/dashboard";

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  vacancies: Activity,
  submitted: FileText,
  upcoming: Sparkles,
  results: ClipboardCheck,
  pending: FileClock,
  verified: CheckCircle2,
};

type StatsCardsProps = Readonly<{
  readonly stats: ReadonlyArray<DashboardStat>;
}>;

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <section aria-label="Dashboard overview cards" className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = iconMap[stat.id] ?? Activity;

        return (
          <Card key={stat.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  {stat.value.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{stat.changeText}</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                <Icon size={18} aria-hidden="true" />
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
