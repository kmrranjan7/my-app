type RightSideItem = {
  title: string;
  time: string;
  category: "Admit Card" | "Result";
  badge: string;
};

const admitCards: RightSideItem[] = [
  {
    title: "UPSC NDA 2026",
    time: "1 hour ago",
    category: "Admit Card",
    badge: "UPSC",
  },
  {
    title: "SSC MTS",
    time: "3 hours ago",
    category: "Admit Card",
    badge: "SSC",
  },
  {
    title: "Railway NTPC",
    time: "6 hours ago",
    category: "Admit Card",
    badge: "Railway",
  },
  {
    title: "IBPS Clerk",
    time: "9 hours ago",
    category: "Admit Card",
    badge: "IBPS",
  },
  {
    title: "STET 2026",
    time: "12 hours ago",
    category: "Admit Card",
    badge: "STET",
  },
  {
    title: "CTET December 2026",
    time: "1 day ago",
    category: "Admit Card",
    badge: "CTET",
  },
];

const results: RightSideItem[] = [
  {
    title: "SSC CPO Final Result",
    time: "2 hours ago",
    category: "Result",
    badge: "SSC",
  },
  {
    title: "UP Police Result 2026",
    time: "5 hours ago",
    category: "Result",
    badge: "UP",
  },
  {
    title: "Bank PO Mains Result",
    time: "8 hours ago",
    category: "Result",
    badge: "Bank",
  },
  {
    title: "UPSC CDS Result",
    time: "11 hours ago",
    category: "Result",
    badge: "UPSC",
  },
  {
    title: "Railway Group D Result",
    time: "1 day ago",
    category: "Result",
    badge: "Railway",
  },
  {
    title: "CTET Result 2026",
    time: "2 days ago",
    category: "Result",
    badge: "CTET",
  },
];

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
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2 2" />
    </svg>
  );
}

function SidebarCard({
  title,
  badge,
  rows,
  accent,
}: {
  title: string;
  badge: string;
  rows: RightSideItem[];
  accent: "rose" | "indigo";
}) {
  const isRose = accent === "rose";

  return (
    <div
      className={
        isRose
          ? "overflow-hidden rounded-xl border border-rose-100 bg-white shadow-[0_14px_26px_rgba(15,23,42,0.10)] ring-1 ring-rose-50"
          : "overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-[0_14px_26px_rgba(15,23,42,0.10)] ring-1 ring-indigo-50"
      }
    >
      <div
        className={
          isRose
            ? "relative flex items-center justify-between gap-2 bg-gradient-to-r from-rose-700 via-rose-600 to-pink-500 px-3 py-2 text-white"
            : "relative flex items-center justify-between gap-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-500 px-3 py-2 text-white"
        }
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_45%)]" />
        <div className="relative flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
            <UpdateTypeIcon type={title} className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-[15px] font-extrabold tracking-tight">{title}</h2>
        </div>
        <span className="relative rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-white/25">
          {badge}
        </span>
      </div>

      <div className="max-h-[260px] overflow-y-auto bg-gradient-to-b from-white to-slate-50/30">
        <table className="w-full border-collapse text-[11px]">
          <tbody>
            {rows.map((item, index) => (
              <tr
                key={`${item.title}-${index}`}
                className={
                  isRose
                    ? "odd:bg-white even:bg-rose-50/25 transition-colors hover:bg-rose-50/45"
                    : "odd:bg-white even:bg-indigo-50/25 transition-colors hover:bg-indigo-50/45"
                }
              >
                <td className="border-b border-slate-200/80 px-2 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5">
                      <span
                        className={
                          isRose
                            ? "mt-[1px] inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700"
                            : "mt-[1px] inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700"
                        }
                      >
                        <UpdateTypeIcon type={item.category} className="h-2.5 w-2.5" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-0.5 text-[10px] font-medium text-slate-500">{item.time}</p>
                      </div>
                    </div>

                    <span
                      className={
                        isRose
                          ? "rounded-full border border-rose-100 bg-rose-50 px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-wide text-rose-700"
                          : "rounded-full border border-indigo-100 bg-indigo-50 px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-wide text-indigo-700"
                      }
                    >
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
  );
}

export default function HomeRightSidebar() {
  return (
    <aside className="w-full max-w-[320px] space-y-3">
      <SidebarCard title="Admit Card" badge="New" rows={admitCards} accent="rose" />
      <SidebarCard title="Result" badge="Hot" rows={results} accent="indigo" />
    </aside>
  );
}
