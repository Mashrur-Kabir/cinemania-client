import ReviewDetailView from "@/components/modules/dashboard/user-dashboard/review/ReviewDetailView";
import { getSingleReview } from "@/services/review.services";
import { notFound } from "next/navigation";

export default async function PublicReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch the review data
  const { data: review, success } = await getSingleReview(id);

  // 2. If it doesn't exist, show the 404 page
  if (!success || !review) notFound();

  return (
    // 3. Add top padding so it doesn't hide under your fixed navbar
    <div className="pt-32 bg-[#030406] min-h-screen">
      <ReviewDetailView review={review} />
    </div>
  );
}
