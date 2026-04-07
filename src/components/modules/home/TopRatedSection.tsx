import { getTopRatedMedia } from "@/services/home.services";
import { HomeSection } from "./HomeSection";
import MediaCard from "./MediaCard";

export default async function TopRatedSection() {
  const { data: media } = await getTopRatedMedia();

  if (!media?.length) return null;

  return (
    <HomeSection
      title="CRITICALLY ACCLAIMED"
      subtitle="Highest rated masterpieces as voted by the CineMania community."
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
