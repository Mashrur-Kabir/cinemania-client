"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { User, ShieldAlert, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const userColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "Identity",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-4">
          <div className="relative size-10 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0 group-hover:border-cyan-500/40 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <User className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-white/20" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-white tracking-tight truncate group-hover:text-cyan-400 transition-colors duration-300">
              {user.name}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 truncate">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Clearance",
    cell: ({ row }) => {
      const isAdmin = row.original.role === "ADMIN";
      return (
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <ShieldAlert className="size-3.5 text-rose-500 shrink-0" />
          ) : (
            <ShieldCheck className="size-3.5 text-cyan-500 shrink-0" />
          )}
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-colors",
              isAdmin ? "text-rose-500" : "text-cyan-500",
            )}
          >
            {row.original.role}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "ACTIVE";
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] font-black uppercase tracking-widest px-3 py-1 transition-all duration-300",
            isActive
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-500/50",
          )}
        >
          <div
            className={cn(
              "size-1.5 rounded-full mr-2 inline-block",
              isActive ? "bg-emerald-400 animate-pulse" : "bg-rose-500",
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registration",
    cell: ({ row }) => (
      <span className="text-[11px] font-bold text-white/50 uppercase">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
];
