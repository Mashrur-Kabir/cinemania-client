/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Film,
  User,
  Quote,
  Eye,
  Hash,
  Calendar,
  Star,
  AlertTriangle,
} from "lucide-react";
import { IReview } from "@/types/review.types";
import { updateReviewStatusAction } from "@/app/_actions/review.action";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PendingModeration({
  items: initialItems,
}: {
  items: IReview[];
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🎯 NEW STATES: For handling the rejection reasoning flow
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Reset modal states when closing
  const closeModal = () => {
    setSelectedReview(null);
    setIsRejecting(false);
    setRejectReason("");
  };

  // 🎯 Updated to accept the reasoning string
  const handleAction = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    reason?: string,
  ) => {
    setIsProcessing(true);

    // Pass the reason to your server action (make sure your action accepts it!)
    const res = await updateReviewStatusAction(id, status, reason);

    if (res.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      closeModal();
      toast.success(
        `Review ${status === "APPROVED" ? "Approved" : "Rejected"}`,
      );
    } else {
      toast.error("Moderation uplink failed");
    }
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="py-10 text-center opacity-20">
        <Check className="size-8 mx-auto mb-2 text-white" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white">
          Nexus Clear
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <AnimatePresence mode="popLayout">
        {items.slice(0, 5).map((review) => (
          <motion.div
            key={review.id}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{
              x: -4,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderColor: "rgba(225, 29, 72, 0.3)",
            }}
            onClick={() => setSelectedReview(review)}
            className={cn(
              "group relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer transition-all duration-300",
              "hover:shadow-[inset_0_0_15px_rgba(225,29,72,0.05)]",
              "transform-gpu will-change-transform", // 🎯 Locks the card to the GPU
            )}
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Film className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-white uppercase truncate tracking-tighter">
                    {review.media?.title}
                  </h4>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <User className="size-2.5" /> {review.user?.name}
                  </p>
                </div>
              </div>
              <Eye className="size-3 text-white/20 group-hover:text-primary transition-colors mt-1" />
            </div>

            <div className="relative">
              <p className="text-[10px] leading-relaxed text-white/40 line-clamp-2 px-1">
                {review.content}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Detached Global Modal using Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedReview && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10 pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeModal}
                  className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-xl glass-panel border-primary/20 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                  {/* Modal Header */}
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-primary/[0.02] shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
                        <Film className="size-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                          Review Analysis
                        </h2>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                          {selectedReview.media?.title}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                      <X className="size-5 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-8 space-y-8 overflow-y-auto chart-scrollbar-x shrink">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <User className="size-4 text-blue-400" />
                        <div>
                          <p className="text-[8px] text-white/40 uppercase font-black">
                            Author
                          </p>
                          <p className="text-[11px] font-bold text-white uppercase truncate max-w-[80px]">
                            {selectedReview.user?.name}
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
                            {selectedReview.rating}/10
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
                            {new Date(
                              selectedReview.createdAt,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary/40">
                        <Quote className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          The Critique
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm leading-relaxed text-white/70 italic bg-white/[0.01] p-6 rounded-3xl border border-white/5",
                          "shadow-[inset_0_0_20px_rgba(255,255,255,0.01)]",
                        )}
                      >
                        ❝{selectedReview.content}❞
                      </p>
                    </div>

                    {selectedReview.tags && selectedReview.tags.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/20">
                          <Hash className="size-3" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            Metadata Tags
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedReview.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-bold text-white/60 uppercase tracking-tighter hover:text-primary hover:border-primary/40 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 🎯 Modal Footer (Dynamic Action Area) */}
                  <div className="p-8 bg-black/40 border-t border-white/5 shrink-0 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      {!isRejecting ? (
                        <motion.div
                          key="default-actions"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4"
                        >
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleAction(selectedReview.id, "APPROVED")
                            }
                            className={cn(
                              "flex-1 py-4 rounded-2xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50",
                              "hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
                            )}
                          >
                            <Check className="size-4" /> Approve
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => setIsRejecting(true)}
                            className={cn(
                              "px-8 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50",
                              "hover:bg-rose-500 hover:text-white",
                            )}
                          >
                            Reject
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="reject-form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                              <AlertTriangle className="size-3" /> Rejection
                              Reasoning
                            </label>
                            <textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Detail the community guideline violation..."
                              className="w-full min-h-[80px] bg-black/50 border border-rose-500/20 rounded-xl p-4 text-sm text-white focus:border-rose-500/50 outline-none transition-all placeholder:text-rose-500/30 resize-none shadow-[inset_0_0_20px_rgba(225,29,72,0.05)]"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setIsRejecting(false);
                                setRejectReason("");
                              }}
                              disabled={isProcessing}
                              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={!rejectReason.trim() || isProcessing}
                              onClick={() =>
                                handleAction(
                                  selectedReview.id,
                                  "REJECTED",
                                  rejectReason,
                                )
                              }
                              className={cn(
                                "flex-1 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-rose-500/50",
                                "hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95",
                              )}
                            >
                              <X className="size-3" /> Confirm Rejection
                            </button>
                          </div>
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

      <Link href="/admin/dashboard/reports" className="block w-full pt-2">
        <button className="w-full py-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20 transition-all duration-300">
          View Full Queue
        </button>
      </Link>
    </div>
  );
}
