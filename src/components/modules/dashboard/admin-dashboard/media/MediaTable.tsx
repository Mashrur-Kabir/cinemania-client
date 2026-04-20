"use client";

import DataTable from "@/components/shared/table/DataTable";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
// 🎯 THE FIX: Import TMediaPreview from your types, remove IMedia
import { TMediaPreview } from "@/types/media.types";
import { getAllMedia, getAllGenres, IGenre } from "@/services/media.services";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mediaColumns } from "./MediaColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const GENRES_FILTER_KEY = "genres.genreId";
const RELEASE_YEAR_KEY = "releaseYear";
const RATING_KEY = "averageRating";

const MEDIA_FILTER_DEFINITIONS = [
  serverManagedFilter.single("pricing"),
  serverManagedFilter.multi(GENRES_FILTER_KEY),
  serverManagedFilter.range(RELEASE_YEAR_KEY),
  serverManagedFilter.range(RATING_KEY),
];

export default function MediaTable({
  initialQueryString,
}: {
  initialQueryString: string;
}) {
  const searchParams = useSearchParams();

  // 🎯 THE FIX: Pass TMediaPreview as the generic type
  const { tableActions } = useRowActionModalState<TMediaPreview>({
    enableView: true,
    enableEdit: true,
    enableDelete: true,
  });

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

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: MEDIA_FILTER_DEFINITIONS,
      updateParams,
    });

  const {
    data: mediaResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["media", queryString],
    queryFn: () => getAllMedia(queryString),
  });

  const { data: genresResponse, isLoading: isLoadingGenres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getAllGenres(),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const mediaList = mediaResponse?.data || [];
  const genres = useMemo<IGenre[]>(
    () => genresResponse?.data || [],
    [genresResponse],
  );
  const meta = mediaResponse?.meta;

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: "pricing",
        label: "Pricing Tier",
        type: "single-select",
        options: [
          { label: "Free", value: "FREE" },
          { label: "Basic", value: "BASIC" },
          { label: "Pro", value: "PRO" },
          { label: "Premium", value: "PREMIUM" },
        ],
      },
      {
        id: GENRES_FILTER_KEY,
        label: "Genres",
        type: "multi-select",
        options: genres.map((g) => ({ label: g.name, value: g.id })),
      },
      {
        id: RELEASE_YEAR_KEY,
        label: "Release Year",
        type: "range",
      },
      {
        id: RATING_KEY,
        label: "Rating Range",
        type: "range",
      },
    ];
  }, [genres]);

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      pricing: filterValues.pricing,
      [GENRES_FILTER_KEY]: filterValues[GENRES_FILTER_KEY],
      [RELEASE_YEAR_KEY]: filterValues[RELEASE_YEAR_KEY],
      [RATING_KEY]: filterValues[RATING_KEY],
    };
  }, [filterValues]);

  return (
    <div className="space-y-6">
      <div className="p-6 border-white/5 bg-white/[0.01]">
        <DataTable
          data={mediaList}
          columns={mediaColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No titles found in the multiverse."
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
            placeholder: "Search titles, directors...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters,
          }}
          toolbarAction={
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px]">
              <Plus className="size-4" /> Add Title
            </Button>
          }
          meta={meta}
          actions={tableActions}
        />
      </div>
    </div>
  );
}
