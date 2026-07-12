import { SkeletonBlock } from "@/components/dashboard/ui";

export default function DashboardLoading() {
  return (
    <main className="mx-auto w-[min(1320px,95vw)] py-3 sm:py-4" aria-label="Loading dashboard">
      <div className="space-y-3">
        <SkeletonBlock className="h-24" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={`dashboard-stat-${index}`} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <SkeletonBlock className="h-96" />
          <SkeletonBlock className="h-96" />
        </div>
      </div>
    </main>
  );
}
