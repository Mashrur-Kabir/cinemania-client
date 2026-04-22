"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IReview } from "@/types/review.types";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  User,
  Film,
  Check,
  X,
  Clock,
  Eye,
  Quote,
  Hash,
  Calendar,
  MessageSquareWarning, // 🎯 Added new icon
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { updateReviewStatusAction } from "@/app/_actions/review.action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea"; // 🎯 Added Textarea import

// 🎯 Custom Action Cell for instant moderation & deep inspection
const ModerationActions = ({ review }: { review: IReview }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [rejectReason, setRejectReason] = useState(""); // 🎯 NEW: State for rejection reason
  const isClient = typeof window !== "undefined";
  const queryClient = useQueryClient();

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    // 🎯 NEW: Validation block
    if (status === "REJECTED" && !rejectReason.trim()) {
      toast.error("A rejection protocol requires a logged reason.");
      return;
    }

    setIsProcessing(true);
    // 🎯 NEW: Pass the reason if rejecting
    const res = await updateReviewStatusAction(
      review.id,
      status,
      status === "REJECTED" ? rejectReason : undefined,
    );

    if (res.success) {
      toast.success(
        `Signal ${status === "APPROVED" ? "Broadcasted" : "Neutralized"}`,
      );
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      setIsViewOpen(false);
      setConfirmReject(false);
      setRejectReason(""); // 🎯 Clear reason on success
    } else {
      toast.error("Moderation uplink failed");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (!isProcessing) {
              setIsViewOpen(true);
              setConfirmReject(false);
              setRejectReason(""); // 🎯 Clear reason on open
            }
          }}
          className={cn(
            "p-2 rounded-lg border transition-all duration-300 active:scale-95 group",
            "bg-white/5 border-white/10 text-white/40",
            "hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
          )}
          title="Analyze Review"
        >
          <Eye className="size-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* 🚀 Detached Global Modal using Portal */}
      {isClient &&
        createPortal(
          <AnimatePresence>
            {isViewOpen && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10 pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => !isProcessing && setIsViewOpen(false)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-xl glass-panel border-amber-500/20 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] flex flex-col max-h-screen"
                >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-amber-500/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        <Film className="size-6 text-amber-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                          Review Analysis
                        </h2>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">
                          {review.media?.title}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!isProcessing) {
                          setIsViewOpen(false);
                          setConfirmReject(false);
                          setRejectReason("");
                        }
                      }}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors group disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      <X className="size-5 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
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
                      <div className="flex items-center gap-2 text-amber-500/50">
                        <Quote className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          The Critique
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm leading-relaxed text-white/80 italic bg-white/[0.01] p-6 rounded-3xl border border-white/5 break-words whitespace-pre-wrap",
                          "shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]",
                        )}
                      >
                        ❝{review.content}❞
                      </p>
                    </div>

                    {review.tags && review.tags.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/20">
                          <Hash className="size-3" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            Metadata Tags
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {review.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-bold text-white/60 uppercase tracking-tighter hover:text-amber-400 hover:border-amber-400/40 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 🎯 NEW: Inline Confirmation Footer with Textarea */}
                  <div className="p-8 bg-black/40 border-t border-white/5 flex flex-col gap-4 overflow-hidden shrink-0">
                    <AnimatePresence mode="wait">
                      {confirmReject ? (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col gap-4 w-full"
                        >
                          <div className="flex items-center gap-2 text-rose-500 mb-1">
                            <MessageSquareWarning className="size-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Log Rejection Reason (Sent to User)
                            </span>
                          </div>

                          <Textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. Contains inappropriate language or unflagged spoilers..."
                            className="bg-white/5 border-rose-500/30 focus-visible:ring-rose-500/50 text-white min-h-[80px] resize-none"
                            disabled={isProcessing}
                          />

                          <div className="flex items-center gap-3 pt-2">
                            <button
                              disabled={isProcessing}
                              onClick={() => {
                                setConfirmReject(false);
                                setRejectReason("");
                              }}
                              className="px-6 py-4 rounded-2xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-[11px] font-black uppercase tracking-widest transition-all"
                            >
                              Abort
                            </button>
                            <button
                              disabled={isProcessing || !rejectReason.trim()}
                              onClick={() => handleAction("REJECTED")}
                              className="flex-1 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:hover:bg-rose-600 disabled:shadow-none"
                            >
                              {isProcessing
                                ? "Purging..."
                                : "Confirm Rejection"}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="actions"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex w-full gap-4"
                        >
                          <button
                            disabled={isProcessing}
                            onClick={() => handleAction("APPROVED")}
                            className={cn(
                              "flex-1 py-4 rounded-2xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50",
                              "hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
                            )}
                          >
                            <Check className="size-4" /> Approve Transmission
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => setConfirmReject(true)}
                            className={cn(
                              "px-8 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50",
                              "hover:bg-rose-500 hover:text-white",
                            )}
                          >
                            Reject
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export const reportsColumns: ColumnDef<IReview>[] = [
  {
    accessorKey: "media",
    header: "Target Media",
    cell: ({ row }) => {
      const media = row.original.media;
      return (
        <div className="flex items-center gap-3 max-w-[200px]">
          <div className="relative h-10 w-7 rounded overflow-hidden border border-white/10 shrink-0 group-hover:border-amber-500/40 transition-colors">
            {media?.posterUrl ? (
              <Image
                src={media.posterUrl}
                alt="Poster"
                fill
                sizes="28px"
                className="object-cover"
              />
            ) : (
              <Film className="absolute inset-0 m-auto size-3 text-white/20" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-white text-xs truncate group-hover:text-amber-400 transition-colors">
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
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 shrink-0">
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
    accessorKey: "content",
    header: "Critique Payload",
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <p className="text-[11px] text-white/60 leading-relaxed line-clamp-2 italic">
          ❝{row.original.content}❞
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge
            variant="outline"
            className={cn(
              "text-[8px] font-black uppercase px-1.5 py-0",
              "bg-amber-500/10 border-amber-500/20 text-amber-500",
            )}
          >
            <Star className="size-2.5 mr-1 inline-block fill-current" />{" "}
            {row.original.rating}/10
          </Badge>
          {row.original.isSpoiler && (
            <Badge
              variant="outline"
              className={cn(
                "text-[8px] font-black uppercase px-1.5 py-0",
                "bg-rose-500/10 border-rose-500/20 text-rose-500 animate-pulse",
              )}
            >
              Spoiler
            </Badge>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
        <Clock className="size-3" />
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
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
    header: "Resolution",
    cell: ({ row }) => <ModerationActions review={row.original} />,
  },
];
