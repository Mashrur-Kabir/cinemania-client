// src/components/modules/dashboard/user-dashboard/watchlist/WatchlistTimeline.tsx
import { getWatchlist } from "@/services/user.services";
import Pagination from "@/components/shared/pagination/Pagination";
import MediaCard from "@/components/modules/home/MediaCard"; // 🎯 Use the global component
import { IWatchlistItem } from "@/types/dashboard.types";
import { Bookmark } from "lucide-react";

export default async function WatchlistTimeline({ page }: { page: number }) {
  // 🎯 Set a reasonable limit for larger cards (2 rows of 4)
  const limit = 5;
  const { data: items, meta } = await getWatchlist({ page, limit });

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-32 opacity-20 animate-in fade-in duration-700">
        <Bookmark className="size-12 mx-auto mb-4" />
        <p className="text-2xl font-black uppercase tracking-tighter italic">
          Your watchlist is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* 🎯 THE SIZE FIX: Reduced column count for bigger, impactful cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 px-6">
        {items.map((item: IWatchlistItem) => (
          <MediaCard key={item.id} media={item.media} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex justify-center pb-10">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
