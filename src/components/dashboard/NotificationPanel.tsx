import { BellDot } from "lucide-react";

import { Badge, Card, EmptyState, GhostButton, SectionHeading } from "@/components/dashboard/ui";
import type { NotificationItem } from "@/types/dashboard";

type NotificationPanelProps = Readonly<{
  readonly notifications: ReadonlyArray<NotificationItem>;
  readonly onMarkRead: (notificationId: string) => void;
}>;

function notificationVariant(kind: NotificationItem["kind"]) {
  if (kind === "Recruitment") {
    return "info" as const;
  }

  if (kind === "Exam") {
    return "warning" as const;
  }

  if (kind === "Result") {
    return "success" as const;
  }

  return "neutral" as const;
}

export default function NotificationPanel({
  notifications,
  onMarkRead,
}: NotificationPanelProps) {
  return (
    <Card className="p-4">
      <SectionHeading title="Recent Notifications" subtitle="Recruitment alerts, exam updates, and result notices" />
      <div className="mt-4 space-y-3">
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            description="New updates from departments will appear here."
          />
        ) : null}

        {notifications.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <BellDot size={14} aria-hidden="true" />
                {item.title}
              </p>
              <Badge label={item.kind} variant={notificationVariant(item.kind)} />
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.message}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{item.date}</span>
              {item.isNew ? (
                <GhostButton label="Mark as read" onClick={() => onMarkRead(item.id)} />
              ) : (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Read</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
