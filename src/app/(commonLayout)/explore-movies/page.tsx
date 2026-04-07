/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllMedia } from "@/services/media.services";
import MediaCard from "@/components/modules/home/MediaCard";
import { Suspense } from "react";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import FloatingSearch from "@/components/modules/explore/FloatingSearch";
import { Search } from "lucide-react";
import Pagination from "@/components/shared/pagination/Pagination";

export const dynamic = "force-dynamic";

export default async function ExploreMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; searchTerm?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative min-h-screen pb-32">
      <header className="container mx-auto pt-32 pb-10 px-6 text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic uppercase animate-in fade-in slide-in-from-top-8 duration-1000">
          EXPLORE <span className="text-primary">MOVIES.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-lg">
          Dive into the multiverse of cinema. From cult classics to future
          masterpieces.
        </p>
      </header>

      <FloatingSearch />

      <main className="container mx-auto mt-20 px-6">
        {/* 🎯 FIX: Removed the 'key'. 
            Suspense now only shows the fallback on the INITIAL page load.
            When you search, the old movies stay visible while the new ones load.
        */}
        <Suspense
          fallback={
            <div className="space-y-12">
              <SectionSkeleton
                count={12}
                className="grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
              />
            </div>
          }
        >
          <MediaGridContainer params={params} />
        </Suspense>
      </main>
    </div>
  );
}

async function MediaGridContainer({ params }: { params: any }) {
  const page = Number(params.page) || 1;
  const limit = 12;

  const { data: mediaItems, meta } = await getAllMedia({
    page,
    limit,
    searchTerm: params.searchTerm,
  });

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 opacity-30 animate-in fade-in duration-500">
        <Search className="size-12" />
        <p className="text-xl font-bold uppercase tracking-widest">
          No matching titles found
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {mediaItems.map((media, idx) => (
          <div
            key={media.id}
            className="animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <MediaCard media={media} />
          </div>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-24 flex justify-center">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
