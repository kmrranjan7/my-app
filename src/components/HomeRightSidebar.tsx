import Link from "next/link";
import { admitCards, results, type RightSideItem } from "@/data/sidebarContent";

const dynamicBadgePalettes = [
  "border-blue-200 bg-blue-50 text-blue-700",
  "border-rose-200 bg-rose-50 text-rose-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-amber-200 bg-amber-50 text-amber-700",
  "border-violet-200 bg-violet-50 text-violet-700",
  "border-cyan-200 bg-cyan-50 text-cyan-700",
  "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  "border-lime-200 bg-lime-50 text-lime-700",
];

function getTextHash(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    const codePoint = value.codePointAt(i) ?? 0;
    hash = Math.trunc((hash * 31 + codePoint) % 2147483647);
  }

  return Math.abs(hash);
}

function getDynamicBadgeStyles(value: string) {
  if (!value.trim()) {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  const colorIndex = getTextHash(value.toLowerCase()) % dynamicBadgePalettes.length;
  return dynamicBadgePalettes[colorIndex];
}

function UpdateTypeIcon({ type, className }: Readonly<{ type: string; className?: string }>) {
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

function SidebarCard({ title, badge, rows }: Readonly<{
  title: string;
  badge: string;
  rows: RightSideItem[];
}>) {
  return (
    <section className="overflow-hidden rounded-xl border border-indigo-100/90 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.08)] ring-1 ring-indigo-50/80">
      <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-2 py-1.5 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_45%)]" />
        <div className="absolute -right-5 -top-8 h-14 w-14 rounded-full bg-white/10 blur-sm" />
        <div className="relative flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
              <UpdateTypeIcon type={title} className="h-3 w-3" />
            </span>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-indigo-50">{title}</h2>
          </div>
          <span className="rounded-full bg-white/20 px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ring-1 ring-white/25">
            {badge}
          </span>
        </div>
      </header>

      <div className="max-h-[280px] overflow-y-auto bg-gradient-to-b from-white to-indigo-50/20 p-1.5 [content-visibility:auto] [contain-intrinsic-size:360px] [scrollbar-color:#a5b4fc_transparent] [scrollbar-width:thin]">
        <ul className="space-y-1" aria-label={`${title} list`}>
          {rows.map((item, index) => (
            <li key={`${item.title}-${index}`}>
              <article className="group rounded-lg border border-transparent bg-white/85 px-1.5 py-1 shadow-[0_6px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-100 hover:bg-white hover:shadow-[0_10px_20px_rgba(99,102,241,0.1)] focus-within:border-indigo-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-1.5">
                    <span className="relative mt-0.5 inline-flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <UpdateTypeIcon type={item.category} className="h-2.5 w-2.5" />
                      <span className="absolute -bottom-2.5 left-1/2 h-2 w-px -translate-x-1/2 bg-indigo-200/80" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="block truncate text-[10px] font-semibold text-slate-800 underline-offset-2 transition-colors hover:text-indigo-700 active:text-indigo-700 visited:text-indigo-700 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[9px] font-medium text-slate-500">{item.time}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-1.5 py-[2px] text-[8px] font-bold uppercase tracking-[0.08em] ${getDynamicBadgeStyles(item.badge)}`}
                  >
                    {item.badge}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function HomeRightSidebar() {
  return (
    <aside className="w-full space-y-2.5 max-md:max-w-none md:ml-auto md:max-w-[272px] lg:sticky lg:top-[74px] lg:self-start">
      <SidebarCard title="Admit Card" badge="New" rows={admitCards} />
      <SidebarCard title="Result" badge="Hot" rows={results} />
    </aside>
  );
}
