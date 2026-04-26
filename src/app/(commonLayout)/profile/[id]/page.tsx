import { Suspense } from "react";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import ProfileHeader from "@/components/modules/dashboard/user-dashboard/profile/ProfileHeader";
import ProfileStatsGrid from "@/components/modules/dashboard/user-dashboard/profile/ProfileStatsGrid";
import TrophyCase from "@/components/modules/dashboard/user-dashboard/profile/TrophyCase";
import GenreInsight from "@/components/modules/dashboard/user-dashboard/profile/GenreInsight";
import { getUserProfile } from "@/services/user.services";
import { HomeSection } from "@/components/modules/home/HomeSection";
import { getUserApprovedReviews } from "@/services/review.services";
import ReviewStaggerGrid from "@/components/modules/dashboard/user-dashboard/profile/ReviewStaggerGrid"; // 🎯 The new wrapper
import { getUserInfo } from "@/services/auth.services";

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;

  // 🎯 Fetch current user
  const userInfo = await getUserInfo();
  const currentUserId = userInfo?.id;

  const { data: profile } = await getUserProfile(id);
  const { page } = await searchParams;
  const { data: reviews } = await getUserApprovedReviews(id, {
    page: Number(page) || 1,
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000 mt-20">
      <Suspense
        fallback={
          <div className="h-64 w-full bg-white/5 rounded-[3rem] animate-pulse" />
        }
      >
        <ProfileHeader profile={profile} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Suspense
            fallback={<SectionSkeleton count={4} className="grid-cols-2" />}
          >
            <ProfileStatsGrid overview={profile.overview} />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-96 w-full bg-white/5 rounded-[2rem] animate-pulse" />
            }
          >
            <TrophyCase badges={profile.badges} />
          </Suspense>
        </div>

        <div className="space-y-8">
          <Suspense
            fallback={
              <div className="h-[500px] w-full bg-white/5 rounded-[2rem] animate-pulse" />
            }
          >
            <GenreInsight genres={profile.genres} />
          </Suspense>
        </div>
      </div>

      <HomeSection
        title="CRITICAL FOOTPRINT"
        subtitle="See All The Reviews by This Account."
      >
        {reviews.length > 0 ? (
          // 🎯 THE FIX: Drop in the new Stagger Grid
          <ReviewStaggerGrid reviews={reviews} currentUserId={currentUserId} />
        ) : (
          <div className="py-24 text-center rounded-[2.5rem] bg-[#050505] border border-dashed border-white/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20">
              No data transmitted.
            </p>
          </div>
        )}
      </HomeSection>
    </div>
  );
}
