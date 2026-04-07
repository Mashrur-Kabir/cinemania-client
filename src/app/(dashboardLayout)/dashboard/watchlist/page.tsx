import { getWatchlist } from "@/services/userDashboard.services";
import MediaCard from "@/components/modules/home/MediaCard"; // Reuse your existing card
import { HomeSection } from "@/components/modules/home/HomeSection";

export default async function WatchlistPage() {
  const { data: watchlist } = await getWatchlist();

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HomeSection
        title="MY WATCHLIST"
        subtitle="Your curated library of cinematic adventures."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {watchlist?.map((item) => (
            /* We map item.media because your API wraps the media object */
            <MediaCard key={item.id} media={item.media} />
          ))}
        </div>

        {!watchlist?.length && (
          <div className="text-center py-20 opacity-20 italic">
            Your watchlist is empty. Time to find some magic.
          </div>
        )}
      </HomeSection>
    </div>
  );
}
