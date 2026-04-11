import { getWatchlist } from "@/services/user.services";
import MediaCard from "@/components/modules/home/MediaCard";
import { HomeSection } from "@/components/modules/home/HomeSection";
import AddWatchlistModal from "@/components/modules/dashboard/user-dashboard/watchlist/AddWatchlistModal";

export default async function WatchlistPage() {
  const { data: watchlist } = await getWatchlist();

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-6 mb-2">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12 px-6">
        {watchlist?.map((item) => (
          <MediaCard key={item.id} media={item.media} />
        ))}
      </div>

      {!watchlist?.length && (
        <div className="text-center py-40 opacity-20 italic font-medium">
          Your watchlist is empty. Time to find some magic.
        </div>
      )}
    </div>
  );
}
