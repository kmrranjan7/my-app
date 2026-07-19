import type { Metadata } from "next";
import { DEFAULT_SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimer about Sarkari Global Result content and verification from official sources.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "sarkari result disclaimer",
    "government job information disclaimer",
    "information accuracy disclaimer",
    "verify from official website",
    "exam notification disclaimer",
  ],
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-[70vh] px-4 py-10">
      <section className="mx-auto w-[min(920px,95vw)] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Legal</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Disclaimer
        </h1>

        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
          <p>
            Sarkari Global Result is an informational platform and is not an official government
            website.
          </p>
          <p>
            While we make every effort to keep information accurate and updated, users are strongly
            advised to verify all details from official notifications and websites.
          </p>
          <p>
            We are not responsible for any direct or indirect loss arising from the use of
            information published on this website.
          </p>
        </div>
      </section>
    </main>
  );
}
