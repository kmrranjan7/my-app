"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="state-view">
      <section className="state-card" role="alert" aria-live="assertive">
        <h1>An unexpected issue interrupted this view.</h1>
        <p>
          The app is still available. Retry the request or return to the home
          route to continue.
        </p>
        <div className="state-actions">
          <button className="btn btn-primary" onClick={() => unstable_retry()}>
            Retry
          </button>
          <Link className="btn btn-ghost" href="/">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
