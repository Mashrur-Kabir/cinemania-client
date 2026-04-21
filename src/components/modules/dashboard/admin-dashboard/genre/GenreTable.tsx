/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useQuery } from "@tanstack/react-query";
import { IGenre, getAllGenres } from "@/services/genre.services";
import { genreColumns } from "./GenreColumns";
import CreateGenreModal from "./CreateGenreModal";
import EditGenreModal from "./EditGenreModal";
// 🎯 THE FIX: Import PaginationState from tanstack
import { PaginationState } from "@tanstack/react-table";
import DeleteGenreDialog from "./DeleteGenreModal";

export default function GenreTable() {
  const [searchTerm, setSearchTerm] = useState("");

  // 🎯 THE FIX: Initialize local pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // 🎯 THE FIX: Auto-reset to page 1 when the Admin starts searching
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchTerm]);

  const {
    tableActions,
    editingItem,
    isEditModalOpen,
    onEditOpenChange,
    deletingItem,
    isDeleteDialogOpen,
    onDeleteOpenChange,
  } = useRowActionModalState<IGenre>({
    enableView: false,
    enableEdit: true,
    enableDelete: true,
  });

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getAllGenres(),
  });

  const allGenres = response?.data || [];

  // 1. Filter the data based on search
  const filteredGenres = useMemo(() => {
    return allGenres.filter((g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allGenres, searchTerm]);

  // 🎯 THE FIX: 2. Manually slice the data for the current page
  const paginatedGenres = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredGenres.slice(start, end);
  }, [filteredGenres, pagination]);

  // 🎯 THE FIX: 3. Construct the meta object so the footer knows how many pages exist
  const meta = useMemo(() => {
    return {
      total: filteredGenres.length,
      totalPages: Math.ceil(filteredGenres.length / pagination.pageSize),
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
  }, [filteredGenres.length, pagination.pageSize, pagination.pageIndex]);

  return (
    <div className="space-y-6">
      <div className="p-6 border-white/5 bg-white/[0.01]">
        <DataTable
          data={paginatedGenres} // 🎯 Pass the sliced data!
          columns={genreColumns}
          isLoading={isLoading || isFetching}
          emptyMessage="No taxonomy tags registered."
          search={{
            initialValue: searchTerm,
            placeholder: "Search tags...",
            debounceMs: 300,
            onDebouncedChange: setSearchTerm,
          }}
          // 🎯 THE FIX: Pass the pagination controls down to the table
          pagination={{
            state: pagination,
            onPaginationChange: setPagination,
          }}
          meta={meta}
          toolbarAction={<CreateGenreModal />}
          actions={tableActions}
        />
      </div>

      <EditGenreModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        genre={editingItem}
      />

      <DeleteGenreDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        genre={deletingItem}
      />
    </div>
  );
}
