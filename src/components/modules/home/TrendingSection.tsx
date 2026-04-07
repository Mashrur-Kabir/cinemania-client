import { getTrendingMedia } from "@/services/home.services";
import { HomeSection } from "./HomeSection";
import MediaCard from "./MediaCard";

export default async function TrendingSection() {
  const { data: media } = await getTrendingMedia();
  if (!media?.length) return null;

  return (
    <HomeSection
      title="TRENDING NOW"
      subtitle="The most watched titles in the CineMania universe this hour."
      className="w-full" // 🎯 Ensure full width
    >
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
        {media.map((item, i) => (
          <MediaCard key={item.id} media={item} priority={i < 4} />
        ))}
      </div>
    </HomeSection>
  );
}
