import ReviewDetailView from "@/components/modules/dashboard/user-dashboard/review/ReviewDetailView";
import { getSingleReview } from "@/services/review.services";
import { redirect } from "next/navigation";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: review, success } = await getSingleReview(id);

  if (!success || !review) redirect("/dashboard/my-reviews");

  return <ReviewDetailView review={review} />;
}
