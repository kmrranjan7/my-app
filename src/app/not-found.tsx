import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-view">
      <section className="state-card">
        <h1>404: This route does not exist.</h1>
        <p>
          The URL may be outdated or typed incorrectly. Use the primary route to
          continue browsing.
        </p>
        <div className="state-actions">
          <Link className="btn btn-primary" href="/">
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}
