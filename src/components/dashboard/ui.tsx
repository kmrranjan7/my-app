import type { PropsWithChildren, ReactNode } from "react";

type CardProps = PropsWithChildren<{
  readonly className?: string;
}>;

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type BadgeProps = Readonly<{
  readonly label: string;
  readonly variant?: BadgeVariant;
}>;

const badgeClasses: Record<BadgeVariant, string> = {
  success:
    "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  warning:
    "border-amber-300/60 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-300",
  danger:
    "border-rose-300/60 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-300",
  info: "border-blue-300/60 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/35 dark:text-blue-300",
  neutral:
    "border-slate-300/70 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
};

export function Card({ children, className }: Readonly<CardProps>) {
  return (
    <article
      className={[
        "rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_10px_34px_rgba(2,6,23,0.06)]",
        "backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}

export function SectionHeading(
  props: Readonly<{
    readonly title: string;
    readonly subtitle?: string;
    readonly action?: ReactNode;
  }>,
) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[1.02rem] font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {props.title}
        </h2>
        {props.subtitle ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {props.subtitle}
          </p>
        ) : null}
      </div>
      {props.action ? <div>{props.action}</div> : null}
    </header>
  );
}

export function Badge({ label, variant = "neutral" }: Readonly<BadgeProps>) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        badgeClasses[variant],
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function PrimaryButton(
  props: Readonly<{
    readonly label: string;
    readonly onClick?: () => void;
    readonly disabled?: boolean;
  }>,
) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {props.label}
    </button>
  );
}

export function GhostButton(
  props: Readonly<{
    readonly label: string;
    readonly onClick?: () => void;
    readonly disabled?: boolean;
  }>,
) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {props.label}
    </button>
  );
}

export function SkeletonBlock(
  props: Readonly<{ readonly className?: string }>,
) {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800",
        props.className,
      ].join(" ")}
    />
  );
}

export function EmptyState(
  props: Readonly<{
    readonly title: string;
    readonly description: string;
  }>,
) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {props.title}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {props.description}
      </p>
    </div>
  );
}