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
} from "lucide-react";
import { IReview } from "@/types/review.types";
import { updateReviewStatusAction } from "@/app/_actions/review.action";
import { toast } from "sonner";
import { useState, useEffect } from "react"; // 🎯 Added useEffect for Portals
import { createPortal } from "react-dom"; // 🎯 Added createPortal
import { cn } from "@/lib/utils";

export default function PendingModeration({
  items: initialItems,
}: {
  items: IReview[];
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false); // 🎯 Hydration safety for Portal

  // 🎯 Ensure we only render the portal on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setIsProcessing(true);
    const res = await updateReviewStatusAction(id, status);
    if (res.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedReview(null);
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
    <div className="space-y-4 relative">
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

      {/* 🚀 THE FIX: Detached Global Modal using Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedReview && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10 pointer-events-auto">
                {/* Background Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedReview(null)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />

                {/* Modal Content Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-xl glass-panel border-primary/20 overflow-hidden shadow-2xl"
                >
                  {/* Modal Header */}
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-primary/[0.02]">
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
                      onClick={() => setSelectedReview(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                      <X className="size-5 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto chart-scrollbar-x">
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

                  {/* Modal Footer (Actions) */}
                  <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
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
                      onClick={() =>
                        handleAction(selectedReview.id, "REJECTED")
                      }
                      className={cn(
                        "px-8 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50",
                        "hover:bg-rose-500 hover:text-white",
                      )}
                    >
                      Reject
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body, // 🎯 Renders the modal directly to body
        )}

      {items.length > 5 && (
        <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] pt-2">
          + {items.length - 5} more in queue
        </p>
      )}
    </div>
  );
}
