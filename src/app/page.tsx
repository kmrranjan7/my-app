import HomeLeftSidebar from "@/components/HomeLeftSidebar";
import HomeRightSidebar from "@/components/HomeRightSidebar";

export default function Home() {
  return (
    <main className="w-full py-3">
      <section className="grid w-full grid-cols-1 gap-3 px-0 md:grid-cols-[320px_minmax(0,1fr)_320px] md:px-0">
        <HomeLeftSidebar />
        <div className="min-h-[320px] rounded-xl border border-slate-200 bg-white/60" />
        <HomeRightSidebar />
      </section>
    </main>
  );
}
