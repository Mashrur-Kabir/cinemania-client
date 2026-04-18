import { Suspense } from "react";

import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import ProfileHeader from "@/components/modules/dashboard/user-dashboard/profile/ProfileHeader";
import ProfileStatsGrid from "@/components/modules/dashboard/user-dashboard/profile/ProfileStatsGrid";
import TrophyCase from "@/components/modules/dashboard/user-dashboard/profile/TrophyCase";
import GenreInsight from "@/components/modules/dashboard/user-dashboard/profile/GenreInsight";
import { getUserProfile } from "@/services/user.services";
import { HomeSection } from "@/components/modules/home/HomeSection";
import { getUserApprovedReviews } from "@/services/review.services";
import PublicReviewCard from "@/components/modules/dashboard/user-dashboard/profile/PublicReviewCard";

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  // 🎯 Fetch once at the top
  const { data: profile } = await getUserProfile(id);
  const { page } = await searchParams;
  const { data: reviews } = await getUserApprovedReviews(id, {
    page: Number(page) || 1,
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000 mt-20">
      {/* 🎭 Cinematic Header */}
      <Suspense
        fallback={
          <div className="h-64 w-full bg-white/5 rounded-[3rem] animate-pulse" />
        }
      >
        <ProfileHeader profile={profile} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 📊 Overview Stats */}
          <Suspense
            fallback={<SectionSkeleton count={4} className="grid-cols-2" />}
          >
            <ProfileStatsGrid overview={profile.overview} />
          </Suspense>

          {/* 🏆 Trophy Case */}
          <Suspense
            fallback={
              <div className="h-96 w-full bg-white/5 rounded-[2rem] animate-pulse" />
            }
          >
            <TrophyCase badges={profile.badges} />
          </Suspense>
        </div>

        <div className="space-y-8">
          {/* 🍿 Taste Insights */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <PublicReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-panel rounded-[2rem] border-white/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20">
              No data transmitted.
            </p>
          </div>
        )}
      </HomeSection>
    </div>
  );
}
