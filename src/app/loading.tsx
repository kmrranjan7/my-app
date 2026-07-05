export default function Loading() {
  return (
    <main className="state-view" aria-busy="true" aria-live="polite">
      <section className="state-card">
        <div className="state-actions">
          <span className="btn btn-ghost">Loading...</span>
        </div>
      </section>
    </main>
  );
}
