// src/app/(dashboardLayout)/dashboard/profile/page.tsx
import { Suspense } from "react";

import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import ProfileStatsGrid from "@/components/modules/dashboard/user-dashboard/profile/ProfileStatsGrid";
import TrophyCase from "@/components/modules/dashboard/user-dashboard/profile/TrophyCase";
import GenreInsight from "@/components/modules/dashboard/user-dashboard/profile/GenreInsight";
import ProfileHeader from "@/components/modules/dashboard/user-dashboard/profile/ProfileHeader";

export default async function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000">
      <Suspense
        fallback={
          <div className="h-64 w-full bg-white/5 rounded-[3rem] animate-pulse" />
        }
      >
        <ProfileHeader />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Suspense
            fallback={<SectionSkeleton count={4} className="grid-cols-2" />}
          >
            <ProfileStatsGrid />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-96 w-full bg-white/5 rounded-[2rem] animate-pulse" />
            }
          >
            <TrophyCase />
          </Suspense>
        </div>

        <div className="space-y-8">
          <Suspense
            fallback={
              <div className="h-[500px] w-full bg-white/5 rounded-[2rem] animate-pulse" />
            }
          >
            <GenreInsight />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
