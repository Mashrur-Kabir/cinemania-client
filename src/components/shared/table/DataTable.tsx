"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationMeta } from "@/types/api.types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import DataTableFilters, {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues,
} from "./DataTableFilters";
import DataTablePagination from "./DataTablePagination";
import DataTableSearch from "./DataTableSearch";
import { cn } from "@/lib/utils";

interface DataTableActions<TData> {
  onView?: (data: TData) => void;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  actions?: DataTableActions<TData>;
  toolbarAction?: React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  sorting?: {
    state: SortingState;
    onSortingChange: (state: SortingState) => void;
  };
  pagination?: {
    state: PaginationState;
    onPaginationChange: (state: PaginationState) => void;
  };
  search?: {
    initialValue?: string;
    placeholder?: string;
    debounceMs?: number;
    onDebouncedChange: (value: string) => void;
  };
  filters?: {
    configs: DataTableFilterConfig[];
    values: DataTableFilterValues;
    onFilterChange: (
      filterId: string,
      value: DataTableFilterValue | undefined,
    ) => void;
    onClearAll?: () => void;
  };
  meta?: PaginationMeta;
}

const DataTable = <TData,>({
  data = [] as TData[],
  columns,
  actions,
  toolbarAction,
  emptyMessage,
  isLoading,
  sorting,
  pagination,
  search,
  filters,
  meta,
}: DataTableProps<TData>) => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const hydratedIsLoading = hasHydrated ? Boolean(isLoading) : false;
  const showLoadingOverlay = hydratedIsLoading;

  const tableColumns: ColumnDef<TData>[] = actions
    ? [
        ...columns,
        // Action column
        {
          id: "actions",
          header: "Actions",
          enableSorting: false,
          cell: ({ row }) => {
            const rowData = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="h-8 w-8 p-0 hover:bg-white/10 hover:text-primary transition-colors"
                  >
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl"
                >
                  {actions.onView && (
                    <DropdownMenuItem
                      className="focus:bg-primary/20 focus:text-primary cursor-pointer transition-colors"
                      onClick={() => actions.onView?.(rowData)}
                    >
                      View Details
                    </DropdownMenuItem>
                  )}
                  {actions.onEdit && (
                    <DropdownMenuItem
                      className="focus:bg-blue-500/20 focus:text-blue-400 cursor-pointer transition-colors"
                      onClick={() => actions.onEdit?.(rowData)}
                    >
                      Edit Entry
                    </DropdownMenuItem>
                  )}
                  {actions.onDelete && (
                    <DropdownMenuItem
                      className="focus:bg-rose-500/20 focus:text-rose-500 cursor-pointer transition-colors"
                      onClick={() => actions.onDelete?.(rowData)}
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ]
    : columns;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: !!sorting,
    manualPagination: !!pagination,
    pageCount: pagination ? Math.max(meta?.totalPages ?? 0, 0) : undefined,
    state: {
      ...(sorting ? { sorting: sorting.state } : {}),
      ...(pagination ? { pagination: pagination.state } : {}),
    },
    onSortingChange: sorting
      ? (updater) => {
          const currentSortingState = sorting.state;
          const nextSortingState =
            typeof updater === "function"
              ? updater(currentSortingState)
              : updater;
          sorting.onSortingChange(nextSortingState);
        }
      : undefined,
    onPaginationChange: pagination
      ? (updater) => {
          const currentPaginationState = pagination.state;
          const nextPaginationState =
            typeof updater === "function"
              ? updater(currentPaginationState)
              : updater;
          pagination.onPaginationChange(nextPaginationState);
        }
      : undefined,
  });

  return (
    <div className="relative flex flex-col h-full">
      {/* 🔦 Neon Loading Overlay */}
      {showLoadingOverlay && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-xl transition-all duration-300">
          <div className="flex flex-col items-center gap-3 p-6 glass-panel border-primary/20 shadow-[0_0_30px_rgba(225,29,72,0.15)]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
              Syncing...
            </span>
          </div>
        </div>
      )}

      {(search || filters || toolbarAction) && (
        <div className="mb-6 flex flex-wrap items-start gap-4">
          {search && (
            <DataTableSearch
              key={search.initialValue ?? ""}
              initialValue={search.initialValue}
              placeholder={search.placeholder}
              debounceMs={search.debounceMs}
              onDebouncedChange={search.onDebouncedChange}
              isLoading={hydratedIsLoading}
            />
          )}

          {filters && (
            <DataTableFilters
              filters={filters.configs}
              values={filters.values}
              onFilterChange={filters.onFilterChange}
              onClearAll={filters.onClearAll}
              isLoading={hydratedIsLoading}
            />
          )}

          {toolbarAction && (
            <div className="ml-auto shrink-0">{toolbarAction}</div>
          )}
        </div>
      )}

      {/* 🎯 THE FIX: min-h-[500px] added to prevent the sudden shrinking */}
      <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden flex flex-col justify-between min-h-[500px] shadow-xl">
        <div className="overflow-x-auto chart-scrollbar-x">
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/10">
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="border-none hover:bg-transparent"
                >
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 align-middle text-[10px] font-black uppercase tracking-widest text-white/40"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant={"ghost"}
                          className="h-auto cursor-pointer p-0 font-black uppercase tracking-widest hover:bg-transparent hover:text-white focus-visible:ring-0 transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="ml-1 h-3 w-3 text-primary" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-1 h-3 w-3 text-primary" />
                          ) : (
                            <ArrowUpDown className="ml-1 h-3 w-3 opacity-20" />
                          )}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-200 group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-64 text-center"
                  >
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <p className="text-xs font-black uppercase tracking-widest">
                        {emptyMessage || "No data available."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination is anchored to the bottom of the min-h container */}
        {pagination && (
          <div className="mt-auto border-t border-white/10 bg-black/40">
            <DataTablePagination
              table={table}
              totalPages={meta?.totalPages}
              totalRows={meta?.total}
              isLoading={hydratedIsLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
