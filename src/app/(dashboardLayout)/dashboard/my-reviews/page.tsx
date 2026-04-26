import { Suspense } from "react";
import { HomeSection } from "@/components/modules/home/HomeSection";
import AddReviewModal from "@/components/modules/dashboard/user-dashboard/review/AddReviewModal";
import ReviewsTimeline from "@/components/modules/dashboard/user-dashboard/review/ReviewsTimeline";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArchiveX } from "lucide-react"; // 🎯 Added Icon

export const revalidate = 0;

export default async function MyReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const userInfo = await getUserInfo();
  if (!userInfo) redirect("/login");

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6">
      <HomeSection
        title="MY REVIEWS"
        subtitle="Your critical footprint across the multiverse."
      >
        {/* 🎯 THE FIX: Action Zone with the new Archive link */}
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 mb-12 -mt-6">
          <Link
            href="/dashboard/my-reviews/archive"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 group"
          >
            <ArchiveX className="size-4 group-hover:-translate-y-0.5 transition-transform" />
            View Quarantined Records
          </Link>
          <AddReviewModal />
        </div>

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
