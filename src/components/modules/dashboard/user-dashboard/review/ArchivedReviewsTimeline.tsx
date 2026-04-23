import { getMyArchivedReviews } from "@/services/review.services";
import Pagination from "@/components/shared/pagination/Pagination";
import { IReview } from "@/types/review.types";
import { ShieldAlert } from "lucide-react";
import ArchivedReviewCard from "./ArchivedReviewCard";

export default async function ArchivedReviewsTimeline({
  page,
}: {
  page: number;
}) {
  const limit = 6;
  const { data: reviews, meta } = await getMyArchivedReviews({ page, limit });

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-32 rounded-[2.5rem] border border-dashed border-rose-500/20 bg-rose-500/[0.02] flex flex-col items-center gap-6">
        <ShieldAlert className="size-12 text-rose-500/20" />
        <div className="space-y-2">
          <p className="text-lg font-bold text-rose-500/40 uppercase tracking-widest">
            Archive Empty.
          </p>
          <p className="text-sm text-muted-foreground">
            No rejected transmissions found in your sector.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review: IReview) => (
          <ArchivedReviewCard key={review.id} review={review} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center pb-20">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
