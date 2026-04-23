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
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const [trendingRes, reviewRes] = await Promise.all([
    getTrendingMedia(),
    getPublicCommunityFeed({ page: currentPage, limit: 12 }),
  ]);

  const spotlightMedia = trendingRes.data?.[0];
  const initialReviews = reviewRes.data || [];
  const meta = reviewRes.meta;

  return (
    <div className="min-h-screen bg-[#030406] pb-24">
      <CommunityHero media={spotlightMedia} />

      {/* 🎯 Social Feed Layout Structure */}
      <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 bg-[#030406]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="space-y-2">
            <h2 className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
              <span className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
              Live Network
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
              Global <span className="text-white/30">Feed.</span>
            </h3>
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest max-w-xs md:text-right">
            Real-time critiques intercepted from across the cinematic
            multiverse.
          </p>
        </div>

        <Suspense
          key={currentPage}
          fallback={
            <SectionSkeleton
              count={6}
              className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            />
          }
        >
          <CommunityFeed initialReviews={initialReviews} />
        </Suspense>

        {meta && meta.totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <Pagination meta={meta} />
          </div>
        )}
      </main>
    </div>
  );
}
