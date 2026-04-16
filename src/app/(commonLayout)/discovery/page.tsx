import { Suspense } from "react";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { SearchHeader } from "@/components/modules/discovery/SearchHeader";
import MediaGrid from "@/components/modules/discovery/MediaGrid";
import DiscoveryFeed from "@/components/modules/discovery/DiscoveryFeed";
import { getDiscoveryData } from "@/services/discovery.services";

interface DiscoveryPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DiscoveryPage({
  searchParams,
}: DiscoveryPageProps) {
  const params = await searchParams;
  const query = params.search || "";

  // 🎯 Fetching data based on current URL params
  const { data } = await getDiscoveryData(params);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🚀 Dynamic Header */}
      <SearchHeader query={query} />

      <Suspense fallback={<SectionSkeleton count={8} />}>
        {data.searchResults ? (
          // 🔍 Mode A: Search Results Grid
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
                Found {data.searchResults.meta.total} Signals
              </h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <MediaGrid items={data.searchResults.data} />
          </div>
        ) : (
          // 📺 Mode B: Discovery Categorized Feed
          <DiscoveryFeed data={data} />
        )}
      </Suspense>
    </div>
  );
}
