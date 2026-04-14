import { Suspense } from "react";
import { HomeSection } from "@/components/modules/home/HomeSection";
import AddReviewModal from "@/components/modules/dashboard/user-dashboard/review/AddReviewModal";
import ReviewsTimeline from "@/components/modules/dashboard/user-dashboard/review/ReviewsTimeline";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

// No "use server" directive here per your request
export const revalidate = 0;

export default async function MyReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 1. Get the current user session
  const userInfo = await getUserInfo();

  // 🛡️ Guard: Ensure the user is logged in
  if (!userInfo) redirect("/login");

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6">
      <HomeSection
        title="MY REVIEWS"
        subtitle="Your critical footprint across the multiverse."
      >
        {/* 🎯 Primary Action Zone: Kept here for easy access */}
        <div className="flex justify-center md:justify-end mb-12 -mt-6">
          <AddReviewModal />
        </div>

        {/* 🚀 One source of truth: The Timeline handles data and pagination */}
        <Suspense
          key={currentPage}
          fallback={
            <SectionSkeleton
              count={3}
              className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            />
          }
        >
          <ReviewsTimeline userId={userInfo.id} page={currentPage} />
        </Suspense>
      </HomeSection>
    </div>
  );
}
