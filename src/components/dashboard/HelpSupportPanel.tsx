import { CircleHelp, FileQuestion, LifeBuoy, Mail, MessageSquareText, PhoneCall } from "lucide-react";

import { Card, GhostButton, SectionHeading } from "@/components/dashboard/ui";

type HelpTopic = Readonly<{
  readonly id: string;
  readonly title: string;
  readonly description: string;
}>;

const helpTopics: ReadonlyArray<HelpTopic> = [
  {
    id: "apply-issue",
    title: "Application Submission Issues",
    description:
      "Troubleshoot payment failures, invalid document uploads, and incomplete application steps.",
  },
  {
    id: "admit-card",
    title: "Admit Card Download Problems",
    description:
      "Resolve login mismatch, server errors, and card availability timelines for exam stages.",
  },
  {
    id: "result-query",
    title: "Result and Merit List Queries",
    description:
      "Get support for scorecard access, merit list eligibility, and correction request process.",
  },
];

export default function HelpSupportPanel() {
  return (
    <Card className="p-4">
      <SectionHeading
        title="Help & Support"
        subtitle="Get assistance for portal access, application tracking, and exam lifecycle issues"
      />

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <article className="rounded-xl border border-blue-200/70 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/35">
          <h3 className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-900 dark:text-blue-200">
            <LifeBuoy size={14} aria-hidden="true" />
            Contact Support Desk
          </h3>
          <div className="mt-2 space-y-1.5 text-sm text-blue-800 dark:text-blue-300">
            <p className="inline-flex items-center gap-1.5">
              <PhoneCall size={13} aria-hidden="true" />
              Helpline: 1800-123-4567
            </p>
            <p className="inline-flex items-center gap-1.5">
              <Mail size={13} aria-hidden="true" />
              support@sarkariglobalresult.gov.in
            </p>
            <p className="inline-flex items-center gap-1.5">
              <MessageSquareText size={13} aria-hidden="true" />
              Mon-Sat, 9:00 AM - 6:00 PM
            </p>
          </div>
          <div className="mt-3">
            <GhostButton label="Raise Support Ticket" onClick={() => undefined} />
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <h3 className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
            <FileQuestion size={14} aria-hidden="true" />
            Quick Help Topics
          </h3>
          <ul className="mt-2 space-y-2">
            {helpTopics.map((topic) => (
              <li
                key={topic.id}
                className="rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CircleHelp size={13} aria-hidden="true" />
                  {topic.title}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {topic.description}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Card>
  );
}
