import { Suspense } from "react";
import { HomeSection } from "@/components/modules/home/HomeSection";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArchiveX } from "lucide-react";
import ArchivedReviewsTimeline from "@/components/modules/dashboard/user-dashboard/archive/ArchivedReviewsTimeline";
import ArchiveSearch from "@/components/modules/dashboard/user-dashboard/archive/ArchiveSearch";

export const revalidate = 0;

export default async function MyArchivedReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; searchTerm?: string }>;
}) {
  const userInfo = await getUserInfo();
  if (!userInfo) redirect("/login");

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchTerm = params.searchTerm || "";

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6">
      {/* 🔙 Navigation Back to Active Reviews */}
      <Link
        href="/dashboard/my-reviews"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all mb-8 group"
      >
        <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
        Back to Active Feed
      </Link>

      <HomeSection
        title="REJECTED TRANSMISSIONS"
        subtitle="Records purged by Moderation Command. Held for 30 days."
      >
        {/* 🎯 The Search Bar */}
        <ArchiveSearch />

        <Suspense
          key={`${currentPage}-${searchTerm}`}
          fallback={
            <SectionSkeleton
              count={3}
              className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            />
          }
        >
          {/* 🎯 THE FIX: Pass the searchTerm down! */}
          <ArchivedReviewsTimeline page={currentPage} searchTerm={searchTerm} />
        </Suspense>
      </HomeSection>
    </div>
  );
}
