"use client";

import { AlertTriangle } from "lucide-react";

type DashboardErrorProps = Readonly<{
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}>;

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  return (
    <main className="mx-auto w-[min(980px,94vw)] py-12">
      <section className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5" size={20} aria-hidden="true" />
          <div>
            <h1 className="text-xl font-bold">Dashboard Error</h1>
            <p className="mt-2 text-sm opacity-90">
              {error.message || "Something unexpected happened while rendering dashboard."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex rounded-lg border border-rose-400 px-3 py-1.5 text-sm font-semibold transition hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-950/50"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
