import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using SarkariGlobalResult.",
};

export default function TermsPage() {
  return (
    <main className="min-h-[70vh] px-4 py-10">
      <section className="mx-auto w-[min(920px,95vw)] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Legal</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Terms & Conditions
        </h1>

        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
          <p>
            By accessing and using SarkariGlobalResult, you agree to comply with these terms and
            applicable laws.
          </p>
          <p>
            Content is provided for informational purposes only. Users must verify all recruitment
            details from official sources before taking action.
          </p>
          <p>
            We reserve the right to update, modify, or remove content and terms without prior
            notice.
          </p>
        </div>
      </section>
    </main>
  );
}
