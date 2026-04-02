import { getTrendingMedia } from "@/services/home.services";
import { HomeSection } from "./HomeSection";
import MediaCard from "./MediaCard";
// Placeholder: We will build the real MediaCard next

export default async function TrendingSection() {
  const { data: media } = await getTrendingMedia();

  if (!media?.length) return null;

  return (
    <HomeSection
      title="TRENDING NOW"
      subtitle="The most watched titles in the CineMania universe this hour."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {media.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </HomeSection>
  );
}
