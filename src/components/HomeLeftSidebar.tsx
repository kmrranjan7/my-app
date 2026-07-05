type LatestUpdate = {
  title: string;
  time: string;
  type: string;
};

type UpcomingExam = {
  title: string;
  date: string;
  category: "Exam";
  badge: string;
};

const latestUpdates: LatestUpdate[] = [
  
  {
    title: "SSC CGL Result 2024",
    time: "2 hours ago",
    type: "Result",
  },
  {
    title: "Railway Group D Recruitment",
    time: "4 hours ago",
    type: "Job",
  },
  {
    title: "UPSC Prelims Admit Card",
    time: "6 hours ago",
    type: "Admit Card",
  },
  {
    title: "Bank PO Answer Key Released",
    time: "8 hours ago",
    type: "Answer Key",
  },
  {
    title: "Admit Card Updates",
    time: "10 hours ago",
    type: "Admit Card",
  },
  {
    title: "Result Updates",
    time: "12 hours ago",
    type: "Result",
  },
  {
    title: "Admit Card Updates1",
    time: "10 hours ago",
    type: "Admit Card",
  },
  {
    title: "Result Updates1",
    time: "12 hours ago",
    type: "Result",
  },
];

const upcomingExams: UpcomingExam[] = [
  {
    title: "SSC CHSL Tier-I Exam",
    date: "15 Sep 2026",
    category: "Exam",
    badge: "SSC",
  },
  {
    title: "UPSC Civil Services Mains",
    date: "27 Sep 2026",
    category: "Exam",
    badge: "UPSC",
  },
  {
    title: "IBPS PO Prelims",
    date: "04 Oct 2026",
    category: "Exam",
    badge: "IBPS",
  },
  {
    title: "NDA-II Written Exam",
    date: "13 Oct 2026",
    category: "Exam",
    badge: "NDA",
  },
  {
    title: "Railway NTPC CBT",
    date: "21 Oct 2026",
    category: "Exam",
    badge: "Railway",
  },
  {
    title: "CTET December Session",
    date: "08 Dec 2026",
    category: "Exam",
    badge: "CTET",
  },
];

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

function UpdateTypeIcon({ type, className }: { type: string; className?: string }) {
  const normalized = type.toLowerCase();

  if (normalized.includes("admit")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v3a2 2 0 0 0 0 3v3a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-3a2 2 0 0 0 0-3z" />
        <path d="M9 10h6" />
        <path d="M9 14h4" />
      </svg>
    );
  }

  if (normalized.includes("answer")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M8 12h8" />
        <path d="M8 16h5" />
        <path d="M6.5 4h8l3 3v13H6.5A1.5 1.5 0 0 1 5 18.5v-13A1.5 1.5 0 0 1 6.5 4Z" />
      </svg>
    );
  }

  if (normalized.includes("result")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M5 20h14" />
        <path d="M7.5 16V9" />
        <path d="M12 16V6" />
        <path d="M16.5 16v-4" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2v20" />
      <path d="M4 7h8" />
      <path d="M4 11h9" />
      <path d="M4 15h8" />
    </svg>
  );
}

export default function HomeLeftSidebar() {
  return (
    <aside className="w-full max-w-[320px] space-y-3">
      <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-[0_14px_26px_rgba(15,23,42,0.10)] ring-1 ring-emerald-50">
        <div className="relative flex items-center justify-between gap-2 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 px-3 py-2 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_45%)]" />
          <div className="relative flex items-center gap-2">
            <span className="live-bell-wrap inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
              <BellIcon className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-[15px] font-extrabold tracking-tight">Latest Updates</h2>
          </div>
          <span className="live-chip relative rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-white/25">
            Live
          </span>
        </div>

        <div className="max-h-[300px] overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
          <table className="w-full border-collapse text-[11px]">
            <tbody>
              {latestUpdates.map((item, index) => (
                <tr
                  key={`${item.title}-${index}`}
                  className="odd:bg-white even:bg-emerald-50/25 transition-colors hover:bg-emerald-50/45"
                >
                  <td className="border-b border-slate-200/80 px-2 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <span className="mt-[1px] inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <UpdateTypeIcon type={item.type} className="h-2.5 w-2.5" />
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-800">{item.title}</p>
                          <p className="mt-0.5 text-[10px] font-medium text-slate-500">{item.time}</p>
                        </div>
                      </div>

                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-wide text-emerald-700">
                        {item.type}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-[0_14px_26px_rgba(15,23,42,0.10)] ring-1 ring-sky-50">
        <div className="relative flex items-center justify-between gap-2 bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 px-3 py-2 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_45%)]" />
          <div className="relative flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
              <UpdateTypeIcon type="Exam" className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-[15px] font-extrabold tracking-tight">Upcoming Exams</h2>
          </div>
          <span className="relative rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-white/25">
            Soon
          </span>
        </div>

        <div className="max-h-[260px] overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
          <table className="w-full border-collapse text-[11px]">
            <tbody>
              {upcomingExams.map((item, index) => (
                <tr
                  key={`${item.title}-${index}`}
                  className="odd:bg-white even:bg-sky-50/25 transition-colors hover:bg-sky-50/45"
                >
                  <td className="border-b border-slate-200/80 px-2 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <span className="mt-[1px] inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                          <UpdateTypeIcon type={item.category} className="h-2.5 w-2.5" />
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-800">{item.title}</p>
                          <p className="mt-0.5 text-[10px] font-medium text-slate-500">{item.date}</p>
                        </div>
                      </div>

                      <span className="rounded-full border border-sky-100 bg-sky-50 px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-wide text-sky-700">
                        {item.badge}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </aside>
  );
}
