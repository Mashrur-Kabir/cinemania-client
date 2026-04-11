"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AppPagination from "./AppPagination";

interface PaginationProps {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Pagination({ meta }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    // 🎯 Construct new URL parameters while preserving others (like searchTerm)
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    // 🚀 Refresh the page with new results
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <AppPagination
      currentPage={meta.page}
      totalPages={meta.totalPages}
      onPageChange={handlePageChange}
    />
  );
}
