"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TMediaPreview } from "@/types/media.types";
import { Badge } from "@/components/ui/badge";
import { Star, Tv, Video } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const mediaColumns: ColumnDef<TMediaPreview>[] = [
  {
    accessorKey: "posterUrl",
    header: "Poster",
    enableSorting: false,
    cell: ({ row }) => {
      const poster = row.original.posterUrl;
      return (
        <div className="relative h-12 w-8 overflow-hidden rounded border border-white/10 bg-white/5 shrink-0 group-hover:border-primary/40 group-hover:shadow-[0_0_10px_rgba(225,29,72,0.2)] transition-all duration-300">
          {poster ? (
            <Image
              src={poster}
              alt={`${row.original.title} Poster`}
              fill
              sizes="32px"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Video className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary/50 transition-colors" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title & Year",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 min-w-[150px]">
        <span className="font-bold text-white tracking-tight truncate group-hover:text-primary transition-colors duration-300">
          {row.original.title}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white/50 transition-colors">
          {row.original.releaseYear}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "pricing",
    header: "Tier",
    cell: ({ row }) => {
      const pricing = row.original.pricing;
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
            pricing === "PREMIUM" &&
              "border-amber-500/30 text-amber-400 bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/50",
            pricing === "PRO" &&
              "border-blue-500/30 text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50",
            pricing === "BASIC" &&
              "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50",
            pricing === "FREE" &&
              "border-white/20 text-white/60 bg-white/5 group-hover:bg-white/10 group-hover:border-white/40",
          )}
        >
          {pricing}
        </Badge>
      );
    },
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs font-medium text-white/70 min-w-[100px] group-hover:text-white transition-colors duration-300">
        <Tv className="size-3 text-primary shrink-0" />
        <span className="truncate">{row.original.platform}</span>
      </div>
    ),
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Star className="size-3 text-amber-400 fill-amber-400 shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-all duration-300" />
        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
          {row.original.averageRating > 0
            ? row.original.averageRating.toFixed(1)
            : "N/A"}
        </span>
      </div>
    ),
  },
];
