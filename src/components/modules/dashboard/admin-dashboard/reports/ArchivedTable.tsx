"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getAdminArchive } from "@/services/admin.services";
import { archiveColumns } from "./ArchivedColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function ArchiveTable({
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
    queryKey: ["archived-reviews", queryString],
    queryFn: () =>
      getAdminArchive(Object.fromEntries(new URLSearchParams(queryString))),
  });

  const reviewsList = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 border border-rose-500/10 bg-rose-500/[0.01] rounded-3xl shadow-[inset_0_0_50px_rgba(225,29,72,0.02)]">
        <DataTable
          data={reviewsList}
          columns={archiveColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="Archive Empty. No purged records found."
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
            placeholder: "Search purged authors or media...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          meta={meta}
        />
      </div>
    </div>
  );
}
