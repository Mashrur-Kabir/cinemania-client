// src/app/(dashboardLayout)/dashboard/my-reviews/page.tsx
import { getMyReviews } from "@/services/review.services";
import { HomeSection } from "@/components/modules/home/HomeSection";
import UserReviewCard from "@/components/modules/dashboard/user-dashboard/review/UserReviewCard";

export const revalidate = 0;

export default async function MyReviewsPage() {
  const { data: reviews } = await getMyReviews();

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HomeSection
        title="MY REVIEWS"
        subtitle="Your critical footprint across the multiverse."
      >
        {reviews?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <UserReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.01]">
            <p className="text-lg font-bold text-white/20 uppercase tracking-widest">
              No hot takes yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Watch a movie and let the world know what you think.
            </p>
          </div>
        )}
      </HomeSection>
    </div>
  );
}
