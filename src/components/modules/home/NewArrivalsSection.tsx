import { getNewArrivals } from "@/services/home.services";
import { HomeSection } from "./HomeSection";
import MediaCard from "./MediaCard";

export default async function NewArrivalsSection() {
  const { data: media } = await getNewArrivals();

  if (!media?.length) return null;

  return (
    <HomeSection
      title="FRESHLY ADDED"
      subtitle="Newly discovered gems recently added to the CineMania library."
      className="w-full"
    >
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
        {media.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </HomeSection>
  );
}
