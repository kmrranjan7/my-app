type DetailPageShellProps = Readonly<{
  eyebrow: string;
  title: string;
  meta: string;
  badge: string;
  summary: string;
}>;

export default function DetailPageShell({ eyebrow, title, meta, badge, summary }: DetailPageShellProps) {
  return (
    <main className="w-full py-4">
      <section className="mx-auto w-full max-w-[920px] rounded-2xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/35 p-4 shadow-[0_16px_32px_rgba(15,23,42,0.08)] ring-1 ring-indigo-50 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">{eyebrow}</p>
        <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-indigo-700">
            {badge}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
            {meta}
          </span>
        </div>

        <article className="mt-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Overview</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{summary}</p>
        </article>
      </section>
    </main>
  );
}
