import { Suspense } from "react";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import {
  getFollowingFeed,
  getUserStats,
  getWatchlist,
} from "@/services/userDashboard.services";
import StatsOverview from "@/components/modules/dashboard/user-dashboard/overview/StatsOverview";
import ActivityFeed from "@/components/modules/dashboard/user-dashboard/overview/ActivityFeed";
import GenreBar from "@/components/modules/dashboard/user-dashboard/overview/GenreBar";
import WatchlistPreview from "@/components/modules/dashboard/user-dashboard/overview/WatchlistPreview";

export default async function UserDashboardPage() {
  const [statsData, feedData, watchlistData] = await Promise.all([
    getUserStats(),
    getFollowingFeed(),
    getWatchlist(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🚀 Header Area */}
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tighter">
          YOUR{" "}
          <span className="text-primary underline decoration-primary/20 underline-offset-8">
            CINEMA
          </span>{" "}
          FEED
        </h1>
        <p className="text-muted-foreground font-medium">
          Tracking your journey through the multiverse.
        </p>
      </header>

      {/* 📊 High-Performance Stats */}
      <Suspense
        fallback={
          <div className="h-32 w-full animate-pulse bg-white/5 rounded-3xl" />
        }
      >
        {statsData.data && <StatsOverview stats={statsData.data} />}
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
        {/* 🎬 Left Column: Social Activity Feed */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/40">
              Community Pulse
            </h2>
            <div className="h-px flex-1 bg-white/5 mx-4" />
          </div>
          <Suspense fallback={<SectionSkeleton count={3} />}>
            <ActivityFeed activities={feedData.data || []} />
          </Suspense>
        </section>

        {/* 🔖 Right Column: Sidebar Widgets */}
        <aside className="space-y-10">
          {/* Genre Mastery Widget */}
          <div className="glass-panel p-6 space-y-6 border-primary/10">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">
              Genre Mastery
            </h2>
            <div className="space-y-4">
              {statsData.data &&
                Object.entries(statsData.data.genreBreakdown)
                  .slice(0, 5)
                  .map(([genre, count]) => (
                    <div key={genre} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-white/70">
                        <span>{genre}</span>
                        <span className="text-primary">{count} Entries</span>
                      </div>
                      {/* 🎯 FIX: Using our new Client component for animations */}
                      <GenreBar
                        percent={
                          (count / statsData.data!.totalMoviesWatched) * 100
                        }
                      />
                    </div>
                  ))}
            </div>
          </div>

          {/* 🎯 FIX: Quick Watchlist Widget using watchlistData */}
          <div className="glass-panel p-6 border-white/5">
            <WatchlistPreview items={watchlistData.data || []} />
          </div>
        </aside>
      </div>
    </div>
  );
}
