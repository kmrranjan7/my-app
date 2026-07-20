import { Building2, Landmark, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import {
  AUTH_COOKIE_NAME,
  isAuthenticatedCookieValue,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (isAuthenticatedCookieValue(authCookie)) {
    redirect("/dashboard");
  }

  return (
    <main className="relative overflow-hidden py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.2),transparent_34%),radial-gradient(circle_at_90%_15%,rgba(16,185,129,0.18),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_45%,#f5fffb_100%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_90%_15%,rgba(16,185,129,0.2),transparent_28%),linear-gradient(180deg,#020617_0%,#0b1220_45%,#06201b_100%)]" />

      <section className="mx-auto grid w-[min(1160px,95vw)] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center">
        <article className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-[0_20px_55px_rgba(2,6,23,0.1)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            <ShieldCheck size={14} aria-hidden="true" />
            Government Authorized Portal
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Apply, track, and manage your public service career journey.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Access job notifications, exam schedules, admit cards, results, and verification workflows in one secure citizen dashboard.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/70">
              <Landmark size={18} className="text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Departments
              </p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">240+</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/70">
              <Building2 size={18} className="text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Live Vacancies
              </p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">1.2K+</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/70">
              <ShieldCheck size={18} className="text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Secure Access
              </p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">100%</p>
            </div>
          </div>
        </article>

        <LoginForm />
      </section>
    </main>
  );
}
