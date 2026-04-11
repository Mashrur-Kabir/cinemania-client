"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOTS, usePaginationRange } from "@/hooks/use-pagination-range";

interface AppPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function AppPagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: AppPaginationProps) {
  const paginationRange = usePaginationRange(totalPages, currentPage);

  if (currentPage === 0 || paginationRange.length < 2) return null;

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  return (
    <nav
      className={cn(
        "flex items-center justify-center gap-2 select-none",
        className,
      )}
    >
      {/* ⬅️ PREVIOUS BUTTON */}
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
        className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
      >
        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
          Prev
        </span>
      </button>

      {/* 🔢 PAGE NUMBERS */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span key={index} className="px-2 text-white/20 font-black">
                {DOTS}
              </span>
            );
          }

          const isActive = pageNumber === currentPage;

          return (
            <button
              key={index}
              onClick={() => onPageChange(Number(pageNumber))}
              className={cn(
                "relative flex items-center justify-center size-10 rounded-xl text-xs font-black transition-all duration-500",
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5",
              )}
            >
              <span className="relative z-10">{pageNumber}</span>

              {/* 🎯 CINEMATIC ACTIVE GLOW (Framer Motion) */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ➡️ NEXT BUTTON */}
      <button
        disabled={currentPage === totalPages}
        onClick={onNext}
        className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
      >
        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
          Next
        </span>
        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </nav>
  );
}
