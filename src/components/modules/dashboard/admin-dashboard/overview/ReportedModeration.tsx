/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Film,
  User,
  Quote,
  Hash,
  AlertTriangle,
  Flag,
} from "lucide-react";
import { IReportedReview } from "@/types/review.types";
import { updateReviewStatusAction } from "@/app/_actions/review.action";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export default function ReportedModeration({
  items: initialItems,
}: {
  items: IReportedReview[];
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedReport, setSelectedReport] = useState<IReportedReview | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const closeModal = () => {
    setSelectedReport(null);
    setRejectReason("");
  };

  const handleAction = async (
    reportId: string,
    reviewId: string,
    status: "APPROVED" | "REJECTED",
    reason?: string,
  ) => {
    setIsProcessing(true);
    const res = await updateReviewStatusAction(reviewId, status, reason);
    if (res.success) {
      setItems((prev) => prev.filter((item) => item.id !== reportId));
      closeModal();
      toast.success(
        status === "APPROVED"
          ? "Report Dismissed"
          : "Review Rejected & Archived",
      );
    } else {
      toast.error("Moderation uplink failed");
    }
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="py-10 text-center opacity-20">
        <Check className="size-8 mx-auto mb-2 text-muted-foreground/60" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          No Reports Active
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative">
      {/* 🎯 THE FIX: Removed mode="popLayout" for standard smooth fading */}
      <AnimatePresence>
        {items.map((report) => (
          <motion.div
            key={report.id}
            // 🎯 THE FIX: Removed the 'layout' prop to stop aggressive snapping
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedReport(report)}
            className={cn(
              "group relative p-4 rounded-2xl bg-rose-500/[0.02] border border-rose-500/5 cursor-pointer transition-all duration-300 hover:bg-rose-500/10 hover:border-rose-500/30",
              "transform-gpu will-change-transform",
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="size-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Flag className="size-4 text-rose-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-rose-500 uppercase truncate tracking-tighter flex items-center gap-1.5">
                    <Film className="size-3" />{" "}
                    {report.review.media?.title || "Unknown Media"}
                  </h4>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mt-0.5">
                    <User className="size-2.5" /> Reported by {report.user.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <p className="text-[10px] leading-relaxed text-muted-foreground line-clamp-2 px-1 italic">
                <span className="text-rose-500 font-black not-italic mr-1">
                  REASON:
                </span>
                {report.reason}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedReport && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-10 pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeModal}
                  className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-xl border border-rose-500/30 bg-surface-strong overflow-hidden shadow-2xl flex flex-col max-h-[90vh] rounded-[2rem]"
                >
                  {/* Header */}
                  <div className="p-8 border-b border-rose-500/10 flex items-center justify-between bg-rose-500/[0.02] shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                        <AlertTriangle className="size-6 text-rose-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">
                          Report Analysis
                        </h2>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-1.5 mt-0.5">
                          <Film className="size-3" />{" "}
                          {selectedReport.review.media?.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 space-y-8 overflow-y-auto chart-scrollbar-x shrink">
                    {/* The Report */}
                    <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Flag className="size-3" /> Violation Report by{" "}
                        {selectedReport.user.name}
                      </p>
                      <p className="text-sm font-medium text-foreground/90">
                        {selectedReport.reason}
                      </p>
                    </div>

                    {/* Original Review Content */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Quote className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          Offending Critique by <User className="size-3 ml-1" />
                          {selectedReport.review.user?.name || "Unknown User"}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80 italic bg-foreground/[0.01] p-6 rounded-3xl border border-border/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.01)]">
                        ❝{selectedReport.review.content}❞
                      </p>
                    </div>

                    {/* Tags */}
                    {selectedReport.review.tags &&
                      selectedReport.review.tags.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2 text-muted-foreground/60 mt-4">
                            <Hash className="size-3" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                              Metadata Tags
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedReport.review.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-full bg-foreground/[0.03] border border-border text-[9px] font-bold text-muted-foreground uppercase tracking-tighter"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Admin Rejection Reasoning Input */}
                    <div className="space-y-2 pt-6 border-t border-border/50">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Admin Action Reasoning (Sent to Author)
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Detail the community guideline violation..."
                        className="w-full min-h-[80px] bg-foreground/30 border border-rose-500/20 rounded-xl p-4 text-sm text-foreground focus:border-rose-500/50 outline-none transition-all placeholder:text-muted-foreground resize-none shadow-[inset_0_0_20px_rgba(225,29,72,0.05)]"
                      />
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-8 bg-surface border-t border-rose-500/10 flex flex-col gap-3 md:flex-row">
                    <button
                      disabled={isProcessing}
                      onClick={() =>
                        handleAction(
                          selectedReport.id,
                          selectedReport.reviewId,
                          "APPROVED",
                        )
                      }
                      className="flex-1 py-4 rounded-xl bg-foreground/10 text-foreground hover:bg-foreground/20 hover:text-foreground text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-border/50 shadow-sm shadow-foreground/5 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Dismiss Report
                    </button>
                    <button
                      disabled={!rejectReason.trim() || isProcessing}
                      onClick={() =>
                        handleAction(
                          selectedReport.id,
                          selectedReport.reviewId,
                          "REJECTED",
                          rejectReason,
                        )
                      }
                      className={cn(
                        "flex-[1.5] py-4 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none",
                        "hover:bg-rose-500/15 hover:text-rose-500 hover:shadow-[0_0_30px_rgba(225,29,72,0.15)] active:scale-95",
                      )}
                    >
                      <X className="size-4" /> Enforce Ban & Archive
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
