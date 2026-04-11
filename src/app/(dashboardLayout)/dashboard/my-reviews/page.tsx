import { getMyReviews } from "@/services/review.services";
import { HomeSection } from "@/components/modules/home/HomeSection";
import UserReviewCard from "@/components/modules/dashboard/user-dashboard/review/UserReviewCard";
import AddReviewModal from "@/components/modules/dashboard/user-dashboard/review/AddReviewModal";

export const revalidate = 0;

export default async function MyReviewsPage() {
  const { data: reviews } = await getMyReviews();

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6">
      <HomeSection
        title="MY REVIEWS"
        subtitle="Your critical footprint across the multiverse."
      >
        {/* 🎯 Primary Action Zone */}
        <div className="flex justify-center md:justify-end mb-12 -mt-6">
          <AddReviewModal />
        </div>

        {reviews?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <UserReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center gap-6">
            <div className="space-y-2">
              <p className="text-lg font-bold text-white/20 uppercase tracking-widest">
                No hot takes yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Watch a movie and let the world know what you think.
              </p>
            </div>

            {/* 🎯 Secondary trigger in the empty state */}
            <AddReviewModal />
          </div>
        )}
      </HomeSection>
    </div>
  );
}
