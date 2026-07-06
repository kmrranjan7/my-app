import type { Metadata } from "next";
import Link from "next/link";
import { admitCards } from "@/data/sidebarContent";

export const metadata: Metadata = {
  title: "Admit Cards",
  description: "Browse latest admit card notices for government exams.",
};

export default function AdmitCardsIndexPage() {
  return (
    <main className="w-full py-4">
      <section className="mx-auto w-full max-w-[920px] rounded-2xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/35 p-4 shadow-[0_16px_32px_rgba(15,23,42,0.08)] ring-1 ring-indigo-50 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">Admit Cards</p>
        <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Admit Cards</h1>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {admitCards.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-[0_8px_16px_rgba(15,23,42,0.04)] transition-colors hover:border-indigo-200 hover:text-indigo-700"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
