"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    router.push(createPageUrl(newPage), { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={meta.page <= 1}
        onClick={() => handlePageChange(meta.page - 1)}
        className="rounded-xl border-white/5 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all active:scale-90 disabled:opacity-20"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-1 mx-4">
        {[...Array(meta.totalPages)].map((_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === meta.page;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={cn(
                "size-10 rounded-xl text-xs font-black transition-all duration-300",
                isActive
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-110"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white",
              )}
            >
              {pageNum.toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={meta.page >= meta.totalPages}
        onClick={() => handlePageChange(meta.page + 1)}
        className="rounded-xl border-white/5 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all active:scale-90 disabled:opacity-20"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
