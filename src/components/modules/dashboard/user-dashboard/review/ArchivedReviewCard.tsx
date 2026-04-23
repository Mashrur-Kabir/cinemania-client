/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ShieldAlert,
  Edit3,
  Trash2,
  Calendar,
  Lock,
  AlertTriangle,
  Hash,
} from "lucide-react";
import { IReview } from "@/types/review.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { deleteReviewAction } from "@/app/_actions/review.action";
import EditReviewModal from "./EditReviewModal";
import Image from "next/image";

export default function ArchivedReviewCard({ review }: { review: IReview }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const triggerDeleteConfirmation = () => {
    toast.error("Permanently Purge Record?", {
      description: "This will destroy the archived data entirely.",
      icon: <AlertTriangle className="size-4 text-white" />,
      action: {
        label: "Purge",
        onClick: async () => {
          try {
            const res: any = await deleteReviewAction(review.id);
            if (res.success) {
              toast.success("Record destroyed.");
              queryClient.invalidateQueries({
                queryKey: ["my-archived-reviews"],
              });
            } else {
              toast.error(res.message);
            }
          } catch {
            toast.error("Failed to destroy record.");
          }
        },
      },
      cancel: { label: "Abort", onClick: () => toast.dismiss() },
      classNames: {
        toast:
          "bg-rose-950 border border-rose-500/30 text-white rounded-2xl p-5",
        title: "text-white font-bold text-sm tracking-tight",
        description: "text-rose-200/50 text-[11px] font-medium",
        actionButton:
          "bg-black text-white font-bold text-[11px] px-4 py-2 rounded-lg hover:bg-rose-500",
        cancelButton:
          "text-white/40 hover:text-white font-bold text-[11px] px-4 py-2",
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative h-full flex flex-col overflow-hidden rounded-[2.5rem] bg-[#050505]",
        "border border-rose-500/20 transition-all duration-500",
        "hover:border-rose-500/40 hover:shadow-[0_0_40px_-10px_rgba(225,29,72,0.15)]",
      )}
    >
      {/* 🚨 Quarantine Mesh Background Effect - Smooth Fade on Hover */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none opacity-50 transition-opacity duration-700 group-hover:opacity-100",
          "bg-[repeating-linear-gradient(-45deg,rgba(225,29,72,0.03)_0,rgba(225,29,72,0.03)_2px,transparent_2px,transparent_8px)]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent",
          "opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100",
        )}
      />

      <div className="flex flex-col flex-1 p-8 pb-0 gap-6 z-10">
        {/* Header: Movie Info */}
        <div className="flex items-start justify-between relative">
          <div className="flex gap-4 w-full">
            <div
              className={cn(
                "relative h-16 w-11 rounded-lg overflow-hidden shrink-0 shadow-lg",
                "border border-rose-500/30 opacity-60 grayscale transition-all duration-500",
                "group-hover:grayscale-0 group-hover:scale-105 group-hover:border-rose-500/50",
              )}
            >
              <Image
                src={review.media?.posterUrl || ""}
                alt={review.media?.title || "Poster"}
                fill
                sizes="44px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-rose-500/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 text-rose-500 font-black text-[9px] uppercase tracking-[0.25em]">
                  <Lock className="size-3" />
                  <span>Quarantined</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                  <Star className="size-3 text-amber-500 fill-amber-500/50" />
                  <span className="text-[10px] font-black text-white/60">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <h3 className="text-base font-black text-white/60 tracking-tight line-clamp-1 group-hover:text-white transition-colors duration-300">
                {review.media?.title}
              </h3>
            </div>
          </div>
        </div>

        {/* The Moderation Reason (Highlighted) */}
        <div
          className={cn(
            "relative p-5 rounded-[1.5rem] bg-rose-500/5 border border-rose-500/20 overflow-hidden",
            "transition-colors duration-500 group-hover:bg-rose-500/10",
          )}
        >
          <div className="absolute top-0 left-6 w-8 h-[2px] bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,1)]" />
          <div className="flex items-center gap-2 mb-2 text-rose-500">
            <ShieldAlert className="size-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Moderation Log
            </span>
          </div>
          <p className="text-xs font-medium text-rose-100/80 leading-relaxed italic">
            {review.rejectionReason || "Violation of community guidelines."}
          </p>
        </div>

        {/* Original Content (Faded) */}
        <div className="relative flex-1">
          <p className="text-sm leading-relaxed text-muted-foreground/50 group-hover:text-muted-foreground/80 transition-colors duration-500 italic line-clamp-3">
            ❝{review.content}❞
          </p>
        </div>

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {review.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md",
                  "bg-white/[0.02] border border-white/5",
                  "text-[9px] font-bold text-white/30 uppercase tracking-tighter",
                )}
              >
                <Hash className="size-2.5 opacity-50" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 📊 Action Footer */}
      <div className="p-8 pt-6 border-t border-white/5 relative z-10 flex items-center justify-between bg-black/40 mt-6">
        <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-black uppercase tracking-widest group-hover:text-muted-foreground/60 transition-colors">
          <Calendar className="size-3" />
          <span suppressHydrationWarning>
            {typeof window !== "undefined"
              ? format(new Date(review.createdAt), "MMM dd, yyyy")
              : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 🎯 THE APPEAL BUTTON */}
          <button
            onClick={() => setIsEditOpen(true)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
              "bg-white/5 border border-white/10 text-white/60",
              "hover:text-white hover:bg-white/10 hover:border-white/20",
            )}
          >
            <Edit3 className="size-3" /> Revise & Appeal
          </button>

          <button
            onClick={triggerDeleteConfirmation}
            className={cn(
              "p-2 rounded-xl transition-all active:scale-95",
              "text-rose-500/40 border border-transparent",
              "hover:border-rose-500/20 hover:text-rose-500 hover:bg-rose-500/10",
            )}
            title="Destroy Record"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {isEditOpen && (
        <EditReviewModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          review={review}
        />
      )}
    </motion.div>
  );
}
