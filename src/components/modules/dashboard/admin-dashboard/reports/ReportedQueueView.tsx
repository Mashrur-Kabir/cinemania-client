"use client";

import { useQuery } from "@tanstack/react-query";
import { getReportedReviews } from "@/services/admin.services";
import ReportedModeration from "../overview/ReportedModeration";
import Pagination from "@/components/shared/pagination/Pagination";

export default function ReportedQueueView({
  initialQueryString,
}: {
  initialQueryString: string;
}) {
  // Parse the query string back into an object
  const urlParams = Object.fromEntries(new URLSearchParams(initialQueryString));

  // 🎯 THE FIX: Inject your custom limit here! (e.g., 5 items per page)
  const parsedParams: Record<string, string> = {
    ...urlParams,
    limit: "5",
  };

  // Fetch the queue
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "reported-reviews",
      new URLSearchParams(parsedParams).toString(),
    ],
    queryFn: () => getReportedReviews(parsedParams),
    placeholderData: (prev) => prev, // 🔥 important
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
          Decrypting User Reports...
        </p>
      </div>
    );
  }

  const reportedItems = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="p-6 border border-rose-500/20 bg-rose-500/[0.02] rounded-3xl shadow-xl">
      {isFetching && !isLoading && (
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4">
          Syncing latest reports...
        </p>
      )}

      {/* 🎯 THE SECRET FIX: Adding the key forces React to instantly mount the new state! */}
      <ReportedModeration key={initialQueryString} items={reportedItems} />

      {meta && meta.totalPages > 1 && (
        <div className="mt-10 flex justify-center border-t border-rose-500/10 pt-6">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
