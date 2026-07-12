import { Activity, CheckCircle2, ClipboardCheck, FileClock, FileText, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

import { Card } from "@/components/dashboard/ui";
import type { DashboardStat } from "@/types/dashboard";

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  job: Activity,
  admit: FileClock,
  exam: Sparkles,
  vacancies: Activity,
  submitted: FileText,
  upcoming: Sparkles,
  results: ClipboardCheck,
  pending: FileClock,
  verified: CheckCircle2,
};

const cardToneMap: Record<
  string,
  {
    readonly shell: string;
    readonly chip: string;
    readonly glow: string;
  }
> = {
  job: {
    shell:
      "border-0 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white shadow-[0_22px_45px_-24px_rgba(2,132,199,0.75)]",
    chip: "border-white/30 bg-white/15 text-white",
    glow: "bg-cyan-200/25",
  },
  admit: {
    shell:
      "border-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-[0_22px_45px_-24px_rgba(192,38,211,0.7)]",
    chip: "border-white/30 bg-white/15 text-white",
    glow: "bg-fuchsia-200/20",
  },
  exam: {
    shell:
      "border-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white shadow-[0_22px_45px_-24px_rgba(251,146,60,0.72)]",
    chip: "border-white/30 bg-white/15 text-white",
    glow: "bg-amber-200/20",
  },
  results: {
    shell:
      "border-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-[0_22px_45px_-24px_rgba(16,185,129,0.72)]",
    chip: "border-white/30 bg-white/15 text-white",
    glow: "bg-emerald-200/20",
  },
};

type StatsCardsProps = Readonly<{
  readonly stats: ReadonlyArray<DashboardStat>;
  readonly onStatClick?: (statId: string) => void;
}>;

export default function StatsCards({ stats, onStatClick }: StatsCardsProps) {
  return (
    <section
      aria-label="Dashboard overview cards"
      className="flex w-full gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/80 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700"
    >
      {stats.map((stat) => {
        const Icon = iconMap[stat.id] ?? Activity;
        const tone = cardToneMap[stat.id] ?? {
          shell:
            "border-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-[0_22px_45px_-24px_rgba(15,23,42,0.7)]",
          chip: "border-white/25 bg-white/15 text-white",
          glow: "bg-slate-200/15",
        };

        return (
          <button
            key={stat.id}
            type="button"
            onClick={
              onStatClick
                ? () => {
                    onStatClick(stat.id);
                  }
                : undefined
            }
            className={[
              "min-w-[220px] flex-1 rounded-2xl text-left",
              onStatClick ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70" : "cursor-default",
            ].join(" ")}
            aria-label={`Open ${stat.label}`}
          >
            <Card
              className={[
                "group relative isolate overflow-hidden p-3 transition duration-300 hover:-translate-y-0.5",
                tone.shell,
              ].join(" ")}
            >
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -right-8 -top-10 h-20 w-20 rounded-full blur-xl transition duration-300 group-hover:scale-110",
                  tone.glow,
                ].join(" ")}
              />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/85">{stat.changeText}</p>
                </div>
                <div className={["rounded-lg border p-1.5 backdrop-blur-sm", tone.chip].join(" ")}>
                  <Icon size={16} aria-hidden="true" />
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </section>
  );
}
