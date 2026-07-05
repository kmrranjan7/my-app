export default function Loading() {
  return (
    <main className="state-view" aria-busy="true" aria-live="polite">
      <section className="state-card">
        <h1>Preparing your premium experience.</h1>
        <p>
          We are rendering content with full quality checks. This usually takes a
          moment.
        </p>
        <div className="state-actions">
          <span className="btn btn-ghost">Loading...</span>
        </div>
      </section>
    </main>
  );
}
