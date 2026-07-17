import type { Metadata } from "next";
import { DEFAULT_SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read SarkariGlobalResult privacy policy and understand how user data is collected and handled.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "privacy policy",
    "sarkari result privacy",
  ],
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[70vh] px-4 py-10">
      <section className="mx-auto w-[min(920px,95vw)] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Legal</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Privacy Policy
        </h1>

        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
          <p>
            We value your privacy. This page describes what information may be collected when you
            use SarkariGlobalResult and how that information is used.
          </p>
          <p>
            We may collect basic analytics and usage data to improve performance, content quality,
            and user experience. We do not sell personal information to third parties.
          </p>
          <p>
            By using this website, you agree to this privacy policy and any updates published on
            this page.
          </p>
        </div>
      </section>
    </main>
  );
}
