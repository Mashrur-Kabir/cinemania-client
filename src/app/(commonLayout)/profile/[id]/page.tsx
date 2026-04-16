import { Suspense } from "react";

import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import ProfileHeader from "@/components/modules/dashboard/user-dashboard/profile/ProfileHeader";
import ProfileStatsGrid from "@/components/modules/dashboard/user-dashboard/profile/ProfileStatsGrid";
import TrophyCase from "@/components/modules/dashboard/user-dashboard/profile/TrophyCase";
import GenreInsight from "@/components/modules/dashboard/user-dashboard/profile/GenreInsight";
import { getUserProfile } from "@/services/user.services";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // 🎯 Fetch once at the top
  const { data: profile } = await getUserProfile(id);

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
    </div>
  );
}
