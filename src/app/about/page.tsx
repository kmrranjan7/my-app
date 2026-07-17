import type { Metadata } from "next";
import { DEFAULT_SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About SarkariGlobalResult",
  description: "Learn about SarkariGlobalResult, our mission, and how we publish reliable government jobs and exam updates.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "about sarkariglobalresult",
    "government jobs updates platform",
  ],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-[70vh] px-4 py-10">
      <section className="mx-auto w-[min(920px,95vw)] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Company</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          About Us
        </h1>

        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
          <p>
            SarkariGlobalResult is dedicated to providing timely and reliable updates for government
            jobs, admit cards, results, answer keys, admissions, and exam-related notifications.
          </p>
          <p>
            Our goal is to make official opportunities easier to discover through a clean,
            easy-to-navigate platform where aspirants can quickly find important updates.
          </p>
          <p>
            We strongly encourage users to verify every application detail, deadline, and eligibility
            criterion from official notifications before taking action.
          </p>
        </div>
      </section>
    </main>
  );
}
