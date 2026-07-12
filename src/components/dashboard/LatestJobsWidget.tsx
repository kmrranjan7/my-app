import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";

import { Badge, Card, EmptyState, PrimaryButton, SectionHeading } from "@/components/dashboard/ui";
import type { LatestJob } from "@/types/dashboard";

type LatestJobsWidgetProps = Readonly<{
  readonly jobs: ReadonlyArray<LatestJob>;
  readonly creating: boolean;
  readonly onApply: (job: LatestJob) => void;
}>;

function statusVariant(status: LatestJob["status"]) {
  if (status === "Open") {
    return "success" as const;
  }

  if (status === "Closing Soon") {
    return "warning" as const;
  }

  return "danger" as const;
}

export default function LatestJobsWidget({
  jobs,
  creating,
  onApply,
}: LatestJobsWidgetProps) {
  return (
    <Card className="p-4">
      <SectionHeading
        title="Latest Government Jobs"
        subtitle="Explore recently announced recruitment opportunities"
      />

      <div className="mt-4 space-y-3">
        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            description="Try a different search term or clear current filters."
          />
        ) : null}

        {jobs.map((job) => (
          <article
            key={job.id}
            className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{job.title}</h3>
              <Badge label={job.status} variant={statusVariant(job.status)} />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <ShieldCheck size={14} aria-hidden="true" />
              {job.department}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} aria-hidden="true" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} aria-hidden="true" />
                Last Date: {job.lastDate}
              </span>
            </div>
            <div className="mt-3">
              <PrimaryButton
                label={creating ? "Applying..." : "Apply"}
                disabled={creating}
                onClick={() => onApply(job)}
              />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
