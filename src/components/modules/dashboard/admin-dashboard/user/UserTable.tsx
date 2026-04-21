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
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { IUser } from "@/types/user.types";
import { getAllUsers } from "@/services/admin.services";
import EditUserModal from "./EditUserModal";
import { userColumns } from "./UserColumn";
import DeleteUserDialog from "./DeleteUserModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const ROLE_FILTER_KEY = "role";
const STATUS_FILTER_KEY = "status";

const USER_FILTER_DEFINITIONS = [
  serverManagedFilter.single(ROLE_FILTER_KEY),
  serverManagedFilter.single(STATUS_FILTER_KEY),
];

export default function UserTable({
  initialQueryString,
}: {
  initialQueryString: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    tableActions,
    editingItem,
    isEditModalOpen,
    onEditOpenChange,
    deletingItem,
    isDeleteDialogOpen,
    onDeleteOpenChange,
  } = useRowActionModalState<IUser>({
    enableView: true,
    enableEdit: true,
    enableDelete: true,
  });

  const customTableActions = {
    onView: (data: IUser) => router.push(`/profile/${data.id}`), // 🎯 Route to public profile
    onEdit: tableActions.onEdit,
    onDelete: tableActions.onDelete,
  };

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
      definitions: USER_FILTER_DEFINITIONS,
      updateParams,
    });

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["users", queryString],
    queryFn: () => getAllUsers(queryString),
  });

  const usersList = response?.data || [];
  const meta = response?.meta;

  const filterConfigs = useMemo<DataTableFilterConfig[]>(
    () => [
      {
        id: ROLE_FILTER_KEY,
        label: "Clearance Level",
        type: "single-select",
        options: [
          { label: "Admin", value: "ADMIN" },
          { label: "User", value: "USER" },
        ],
      },
      {
        id: STATUS_FILTER_KEY,
        label: "Account Status",
        type: "single-select",
        options: [
          { label: "Active", value: "ACTIVE" },
          { label: "Blocked", value: "BLOCKED" },
        ],
      },
    ],
    [],
  );

  const filterValuesForTable = useMemo<DataTableFilterValues>(
    () => ({
      [ROLE_FILTER_KEY]: filterValues[ROLE_FILTER_KEY],
      [STATUS_FILTER_KEY]: filterValues[STATUS_FILTER_KEY],
    }),
    [filterValues],
  );

  return (
    <div className="space-y-6">
      <div className="p-6 border-white/5 bg-white/[0.01]">
        <DataTable
          data={usersList}
          columns={userColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No personnel records found."
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
            placeholder: "Search identities, emails...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters,
          }}
          meta={meta}
          actions={customTableActions}
        />
      </div>

      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        user={editingItem}
      />
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        user={deletingItem}
      />
    </div>
  );
}
