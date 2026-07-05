import Link from "next/link";
import HomeLeftSidebar from "@/components/HomeLeftSidebar";
import HomeRightSidebar from "@/components/HomeRightSidebar";
import { latestUpdates, results, upcomingExams } from "@/data/sidebarContent";

const featuredUpdates = latestUpdates.slice(0, 3);
const quickResults = results.slice(0, 3);
const quickExams = upcomingExams.slice(0, 3);

export default function Home() {
  return (
    <main className="w-full py-3">
      <section className="grid w-full grid-cols-1 gap-2 px-0 md:grid-cols-[272px_minmax(0,1fr)] md:gap-3 md:px-0 lg:grid-cols-[272px_minmax(0,1fr)_272px] lg:gap-4">
        <HomeLeftSidebar />
        <section className="min-w-0 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/70 p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-4">
          <article className="overflow-hidden rounded-xl border border-indigo-100/80 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-4 py-4 text-white shadow-[0_14px_28px_rgba(30,64,175,0.2)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-100">Daily Intelligence</p>
            <h1 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">CareerPulse Command Center</h1>
            <p className="mt-2 max-w-[56ch] text-sm leading-6 text-blue-50/90">
              Monitor latest jobs, admit cards, exams, and results from one compact dashboard built for speed.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/admit-cards/upsc-nda-2026"
                className="rounded-full border border-white/35 bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Admit Cards
              </Link>
              <Link
                href="/results/ssc-cpo-final-result"
                className="rounded-full border border-white/35 bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Results
              </Link>
              <Link
                href="/exams/ssc-chsl-tier-1"
                className="rounded-full border border-white/35 bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Upcoming Exams
              </Link>
            </div>
          </article>

          <div className="mt-3 grid grid-cols-1 gap-3 [content-visibility:auto] [contain-intrinsic-size:420px] xl:grid-cols-3">
            <article className="rounded-xl border border-indigo-100 bg-white p-3 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-700">Latest Updates</h2>
              <ul className="mt-2 space-y-2">
                {featuredUpdates.map((item) => (
                  <li key={item.href} className="rounded-lg border border-slate-200/90 px-2.5 py-2">
                    <Link
                      href={item.href}
                      className="block text-[12px] font-semibold text-slate-800 transition-colors hover:text-indigo-700"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                      {item.type} · {item.time}
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-sky-100 bg-white p-3 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-sky-700">Upcoming Exams</h2>
              <ul className="mt-2 space-y-2">
                {quickExams.map((item) => (
                  <li key={item.href} className="rounded-lg border border-slate-200/90 px-2.5 py-2">
                    <Link
                      href={item.href}
                      className="block text-[12px] font-semibold text-slate-800 transition-colors hover:text-sky-700"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                      {item.badge} · {item.date}
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-emerald-100 bg-white p-3 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">Result Watch</h2>
              <ul className="mt-2 space-y-2">
                {quickResults.map((item) => (
                  <li key={item.href} className="rounded-lg border border-slate-200/90 px-2.5 py-2">
                    <Link
                      href={item.href}
                      className="block text-[12px] font-semibold text-slate-800 transition-colors hover:text-emerald-700"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                      {item.badge} · {item.time}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
        <div className="md:col-span-2 lg:col-span-1">
          <HomeRightSidebar />
        </div>
      </section>
    </main>
  );
}
