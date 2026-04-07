import { getUserStats } from "@/services/userDashboard.services";
import { Suspense } from "react";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import HistoryTimeline from "@/components/modules/dashboard/user-dashboard/history/HistoryTimeline";

export default async function HistoryPage() {
  // We only await stats here so the header renders immediately
  const { data: stats } = await getUserStats();

  return (
    <div className="relative max-w-6xl mx-auto py-12 px-6">
      {/* 🎭 Page Header */}
      <header className="mb-24 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">
          THE <span className="text-primary">DIARY.</span>
        </h1>
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Total Entries
            </p>
            <p className="text-2xl font-black text-white">
              {stats?.totalMoviesWatched || 0}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Fresh This Month
            </p>
            <p className="text-2xl font-black text-primary">
              {stats?.watchedThisMonth || 0}
            </p>
          </div>
        </div>
      </header>

      {/* 🚀 The Timeline View */}
      <div className="relative">
        {/* Continuous Center Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent opacity-20" />

        {/* 🎯 FIX: Using Suspense and SectionSkeleton */}
        <Suspense
          fallback={
            <div className="space-y-20">
              <SectionSkeleton
                count={3}
                className="grid-cols-1 md:grid-cols-1"
              />
            </div>
          }
        >
          <HistoryTimeline />
        </Suspense>
      </div>
    </div>
  );
}
