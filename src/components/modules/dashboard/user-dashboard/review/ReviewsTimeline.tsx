import { getMyReviews } from "@/services/review.services";
import UserReviewCard from "./UserReviewCard";
import Pagination from "@/components/shared/pagination/Pagination";
import AddReviewModal from "./AddReviewModal";
import { IReview } from "@/types/review.types";

export default async function ReviewsTimeline({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  // 🎯 Set a limit that fits your 3-column layout (e.g., 6)
  const limit = 3;
  const { data: reviews, meta } = await getMyReviews(userId, { page, limit });

  // 🛡️ Handles the empty state locally
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-32 rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center gap-6">
        <div className="space-y-2">
          <p className="text-lg font-bold text-white/20 uppercase tracking-widest">
            No hot takes yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Watch a movie and let the world know what you think.
          </p>
        </div>
        <AddReviewModal />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* 🎬 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review: IReview) => (
          <UserReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* 🧭 Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center pb-20">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
