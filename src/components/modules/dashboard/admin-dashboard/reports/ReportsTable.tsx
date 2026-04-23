"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getPendingReviews } from "@/services/admin.services";
import { reportsColumns } from "./ReportsColumn";
import { Crosshair, X } from "lucide-react"; // 🎯 Added Tactical Icons
import { cn } from "@/lib/utils";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function ReportsTable({
  initialQueryString,
}: {
  initialQueryString: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const targetId = searchParams.get("targetId");

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["pending-reviews", queryString],
    queryFn: () =>
      getPendingReviews(Object.fromEntries(new URLSearchParams(queryString))),
  });

  const reviewsList = response?.data || [];
  const meta = response?.meta;

  // 🎯 THE FIX: Function to wipe the targetId and reload the full queue
  const clearTargetLock = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("targetId");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 🎯 THE FIX: High-Tech Isolation Banner */}
      {targetId && (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-[0_0_30px_rgba(225,29,72,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,1)]" />
          <div className="flex items-center gap-4 pl-2">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 animate-pulse">
              <Crosshair className="size-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-rose-500">
                Target Signal Isolated
              </h3>
              <p className="text-[10px] font-bold text-rose-200/50 uppercase tracking-widest mt-1">
                System ID: {targetId.split("-")[0]}
              </p>
            </div>
          </div>
          <button
            onClick={clearTargetLock}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-rose-500 hover:border-rose-500 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all active:scale-95"
          >
            Clear Lock <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Dynamic wrapper that responds to the isolation state */}
      <div
        className={cn(
          "p-6 rounded-[2rem] transition-all duration-700",
          targetId
            ? "bg-rose-500/[0.01] border-rose-500/20 shadow-[inset_0_0_50px_rgba(225,29,72,0.03)] border"
            : "border-white/5 bg-white/[0.01] border",
        )}
      >
        <DataTable
          data={reviewsList}
          columns={reportsColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="Nexus Clear. No pending moderation tasks."
          sorting={{
            state: optimisticSortingState,
            onSortingChange: handleSortingChange,
          }}
          pagination={{
            state: optimisticPaginationState,
            onPaginationChange: handlePaginationChange,
          }}
          search={{
            initialValue: searchTermFromUrl,
            placeholder: "Search by author or media...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          meta={meta}
        />
      </div>
    </div>
  );
}
