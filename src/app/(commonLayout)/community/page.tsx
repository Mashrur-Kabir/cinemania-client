import { getTrendingMedia } from "@/services/home.services";
import { getPublicCommunityFeed } from "@/services/review.services";
import { Suspense } from "react";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import CommunityHero from "@/components/modules/community/CommunityHero";
import CommunityFeed from "@/components/modules/community/CommunityFeed";
import Pagination from "@/components/shared/pagination/Pagination";

export const revalidate = 600;

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 🎯 THE FIX: Handle pagination params
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const [trendingRes, reviewRes] = await Promise.all([
    getTrendingMedia(),
    getPublicCommunityFeed({ page: currentPage, limit: 12 }), // 🎯 Fetch specific page
  ]);

  const spotlightMedia = trendingRes.data?.[0];
  const initialReviews = reviewRes.data || [];
  const meta = reviewRes.meta; // 🎯 Extract pagination meta from backend

  return (
    <div className="min-h-screen bg-[#030406] pb-20">
      <CommunityHero media={spotlightMedia} />

      <main className="container mx-auto px-6 -mt-32 relative z-20">
        <div className="space-y-4 mb-12">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">
            Multiverse Frequency
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
            Latest <span className="text-white/20">Critiques.</span>
          </h3>
        </div>

        <Suspense key={currentPage} fallback={<SectionSkeleton count={6} />}>
          <CommunityFeed initialReviews={initialReviews} />
        </Suspense>

        {/* 🎯 THE FIX: Add Pagination Control */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-20">
            <Pagination meta={meta} />
          </div>
        )}
      </main>
    </div>
  );
}
