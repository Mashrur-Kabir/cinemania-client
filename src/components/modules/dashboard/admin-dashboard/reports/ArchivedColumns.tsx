"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IReview } from "@/types/review.types";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  User,
  Film,
  Clock,
  Eye,
  Quote,
  Hash,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// 🎯 Archive Action Cell: Only View is permitted here
const ArchiveActions = ({ review }: { review: IReview }) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const isClient = typeof window !== "undefined";

  return (
    <>
      <button
        onClick={() => setIsViewOpen(true)}
        className={cn(
          "p-2 rounded-lg border transition-all duration-300 active:scale-95 group",
          "bg-white/5 border-white/10 text-white/40",
          "hover:bg-rose-500/20 hover:text-rose-500 hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(225,29,72,0.2)]",
        )}
        title="Analyze Purged Record"
      >
        <Eye className="size-4 group-hover:scale-110 transition-transform" />
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {isViewOpen && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10 pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsViewOpen(false)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-xl glass-panel border-rose-500/30 overflow-hidden shadow-[0_0_80px_rgba(225,29,72,0.15)] flex flex-col max-h-screen"
                >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-rose-500/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                        <ShieldAlert className="size-6 text-rose-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                          Archived Record
                        </h2>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">
                          {review.media?.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                    {/* 🚨 REJECTION LOG */}
                    <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,1)]" />
                      <div className="flex items-center gap-2 text-rose-500 mb-3">
                        <ShieldAlert className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Official Rejection Log
                        </span>
                      </div>
                      <p className="text-sm text-rose-200/80 italic font-medium leading-relaxed">
                        {review.rejectionReason ||
                          "Violation of system guidelines. No specific reason logged."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <User className="size-4 text-cyan-400" />
                        <div className="min-w-0">
                          <p className="text-[8px] text-white/40 uppercase font-black">
                            Author
                          </p>
                          <p className="text-[11px] font-bold text-white uppercase truncate">
                            {review.user?.name}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <Star className="size-4 text-amber-400" />
                        <div>
                          <p className="text-[8px] text-white/40 uppercase font-black">
                            Rating
                          </p>
                          <p className="text-[11px] font-bold text-white">
                            {review.rating}/10
                          </p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <Calendar className="size-4 text-emerald-400" />
                        <div>
                          <p className="text-[8px] text-white/40 uppercase font-black">
                            Submitted
                          </p>
                          <p className="text-[11px] font-bold text-white">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <Quote className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Original Payload
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-white/50 italic bg-white/[0.01] p-6 rounded-3xl border border-white/5 break-words whitespace-pre-wrap">
                        ❝{review.content}❞
                      </p>
                    </div>

                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-tighter"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export const archiveColumns: ColumnDef<IReview>[] = [
  {
    accessorKey: "media",
    header: "Target Media",
    cell: ({ row }) => {
      const media = row.original.media;
      return (
        <div className="flex items-center gap-3 max-w-[200px]">
          <div className="relative h-10 w-7 rounded overflow-hidden border border-white/5 shrink-0 opacity-60">
            {media?.posterUrl ? (
              <Image
                src={media.posterUrl}
                alt="Poster"
                fill
                sizes="28px"
                className="object-cover grayscale-[50%]"
              />
            ) : (
              <Film className="absolute inset-0 m-auto size-3 text-white/20" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-white/60 text-xs truncate">
              {media?.title}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Author",
    cell: ({ row }) => {
      const user = row.original.user as typeof row.original.user & {
        email?: string;
      };
      return (
        <div className="flex items-center gap-2 opacity-60">
          <div className="p-1.5 rounded-full bg-white/5 border border-white/5 text-white/40 shrink-0">
            <User className="size-3" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-white/80 text-xs truncate">
              {user?.name}
            </span>
            {user?.email && (
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 truncate">
                {user.email}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rejectionReason",
    header: "Rejection Log",
    cell: ({ row }) => (
      <div className="max-w-[250px]">
        <p className="text-[10px] text-rose-400/80 leading-relaxed line-clamp-2 font-medium">
          {row.original.rejectionReason || "Violation of guidelines."}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Purged On",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500/60 uppercase tracking-wider">
        <Clock className="size-3" />
        {new Date(row.original.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Inspect",
    cell: ({ row }) => <ArchiveActions review={row.original} />,
  },
];
