"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IGenre } from "@/services/genre.services";
import { Hash } from "lucide-react";

export const genreColumns: ColumnDef<IGenre>[] = [
  {
    accessorKey: "id",
    header: "System ID",
    cell: ({ row }) => (
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
        {row.original.id.split("-")[0]}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Taxonomy Tag",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(192,38,211,0.4)] transition-all duration-300">
          <Hash className="size-3" />
        </div>
        <span className="font-black text-white tracking-widest uppercase text-sm group-hover:text-fuchsia-300 transition-colors duration-300">
          {row.original.name}
        </span>
      </div>
    ),
  },
];
