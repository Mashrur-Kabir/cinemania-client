/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserStats } from "@/services/user.services";
import { Suspense } from "react";
import HistoryTimeline from "@/components/modules/dashboard/user-dashboard/history/HistoryTimeline";
import AddHistoryModal from "@/components/modules/dashboard/user-dashboard/history/AddHistoryModal";
import DiaryTimelineSkeleton from "@/components/shared/loaders/DiaryTimelineSkeleton";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { data: stats } = await getUserStats();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

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

        <AddHistoryModal />
      </header>

      {/* 🚀 The Timeline View */}
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent opacity-20" />

        {/* 🎯 Key Fix: Passing the page to the timeline */}
        <Suspense
          key={currentPage} // 🔄 Re-trigger suspense fallback when page changes
          fallback={
            <div className="space-y-20">
              <DiaryTimelineSkeleton count={3} />
            </div>
          }
        >
          <HistoryTimeline page={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
