"use client";

import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const redirectTarget = useMemo(() => {
    const nextParam = params.get("next");

    if (!nextParam?.startsWith("/")) {
      return "/dashboard";
    }

    return nextParam;
  }, [params]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = username.trim().length > 0 && password.length > 0 && !submitting;

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        setErrorMessage(payload?.message ?? "Login failed. Please verify credentials.");
        setSubmitting(false);
        return;
      }

      router.replace(redirectTarget);
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please retry.");
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-300/70 bg-white/90 p-6 shadow-[0_22px_60px_rgba(2,6,23,0.15)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-blue-200/60 blur-2xl dark:bg-blue-900/30" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-emerald-200/70 blur-2xl dark:bg-emerald-900/30" />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">
          Citizen Secure Access
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-[2rem]">
          Government Recruitment Portal Login
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sign in to manage applications, track exam updates, and access your personalized dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
              Username
            </span>
            <span className="relative block">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Enter your username"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
              Password
            </span>
            <span className="relative block">
              <LockKeyhole
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Enter your secure password"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-300">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
