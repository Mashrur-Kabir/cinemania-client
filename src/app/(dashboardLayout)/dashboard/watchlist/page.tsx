// src/app/(dashboardLayout)/dashboard/watchlist/page.tsx
import { Suspense } from "react";
import WatchlistTimeline from "@/components/modules/dashboard/user-dashboard/watchlist/WatchlistTimeline";
import AddWatchlistModal from "@/components/modules/dashboard/user-dashboard/watchlist/AddWatchlistModal";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🎭 Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
            MY <span className="text-primary">WATCHLIST.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Your curated library of cinematic adventures.
          </p>
        </div>

        {/* 🎯 Integration: The Modal Button */}
        <AddWatchlistModal />
      </div>

      {/* 🚀 Paginated Content Area */}
      <Suspense
        key={currentPage}
        fallback={
          <div className="px-6">
            <SectionSkeleton
              count={6}
              className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            />
          </div>
        }
      >
        <WatchlistTimeline page={currentPage} />
      </Suspense>
    </div>
  );
}
