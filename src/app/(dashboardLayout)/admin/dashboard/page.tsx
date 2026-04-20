import { Suspense } from "react";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { getAdminStats, getPendingReviews } from "@/services/admin.services";
import AdminKpiGrid from "@/components/modules/dashboard/admin-dashboard/overview/AdminKpiGrid";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import RevenueMatrix from "@/components/modules/dashboard/admin-dashboard/overview/RevenueMatrix";
import PendingModeration from "@/components/modules/dashboard/admin-dashboard/overview/PendingModeration";

export default async function AdminDashboardPage() {
  const user = await getUserInfo();

  // 🛡️ Guard: Ensure only ADMIN can enter this sector
  if (user?.role !== "ADMIN") redirect("/dashboard");

  const [statsRes, pendingRes] = await Promise.all([
    getAdminStats(),
    getPendingReviews(),
  ]);

  const stats = statsRes.data;
  const pendingReviews = pendingRes.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🚀 System Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            System <span className="text-primary">Nexus</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
          Platform-wide orchestration & real-time analytics.
        </p>
      </header>

      {/* 📊 Key Performance Indicators */}
      <Suspense
        fallback={
          <div className="h-32 w-full animate-pulse bg-white/5 rounded-3xl" />
        }
      >
        {stats && <AdminKpiGrid stats={stats} />}
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
        {/* 📈 Financial & Growth Visuals */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
              Revenue & Engagement Flux
            </h2>
            <div className="h-px flex-1 bg-white/5 mx-6" />
          </div>
          <RevenueMatrix data={stats?.revenueData || []} />
        </section>

        {/* ⚖️ Moderation Sidebar */}
        <aside className="space-y-10">
          <div className="glass-panel p-6 border-primary/20 bg-primary/[0.02]">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-6">
              Moderation Queue
            </h2>
            <Suspense fallback={<SectionSkeleton count={3} />}>
              <PendingModeration items={pendingReviews} />
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}
