import HomeJobsExplorer from "@/components/HomeJobsExplorer";
import HomeLeftSidebar from "@/components/HomeLeftSidebar";
import HomeRightSidebar from "@/components/HomeRightSidebar";
import { latestJobs } from "@/data/sidebarContent";

const HOME_JOBS_PAYLOAD_LIMIT = 48;

export default function HomePage() {
  const jobsForExplorer = latestJobs.slice(0, HOME_JOBS_PAYLOAD_LIMIT);

  return (
    <main className="w-full py-3 sm:py-4">
      <section className="grid w-full grid-cols-1 gap-2 px-0 md:grid-cols-[272px_minmax(0,1fr)] md:gap-3 md:px-0 lg:grid-cols-[272px_minmax(0,1fr)_272px] lg:gap-4">
        <HomeLeftSidebar />
        <HomeJobsExplorer jobs={jobsForExplorer} />
        <div className="md:col-span-2 lg:col-span-1">
          <HomeRightSidebar />
        </div>
      </section>
    </main>
  );
}
