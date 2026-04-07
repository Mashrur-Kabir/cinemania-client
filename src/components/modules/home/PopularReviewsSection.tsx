// src/components/modules/home/PopularReviewsSection.tsx
import { getPopularReviews } from "@/services/home.services";
import { HomeSection } from "./HomeSection";
import ReviewCard from "./ReviewCard";

export default async function PopularReviewsSection() {
  const { data: reviews } = await getPopularReviews();

  if (!reviews?.length) return null;

  return (
    <HomeSection
      title="POPULAR REVIEWS"
      subtitle="Insights and hot takes from the CineMania community."
      className="w-full"
    >
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </HomeSection>
  );
}
