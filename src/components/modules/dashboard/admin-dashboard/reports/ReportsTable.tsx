"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getPendingReviews } from "@/services/admin.services";
import { reportsColumns } from "./ReportsColumn";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function ReportsTable({
  initialQueryString,
}: {
  initialQueryString: string;
}) {
  const searchParams = useSearchParams();

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
      getPendingReviews(Object.fromEntries(new URLSearchParams(queryString))), // ✅ Let the URL state handle it natively
  });

  const reviewsList = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <div className="p-6 border-white/5 bg-white/[0.01]">
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
