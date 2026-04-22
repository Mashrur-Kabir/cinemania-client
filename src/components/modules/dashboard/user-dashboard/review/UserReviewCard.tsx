/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  Heart,
  Trash2,
  Edit3,
  ShieldAlert,
  Clapperboard,
  Calendar,
  AlertTriangle,
  Hash,
} from "lucide-react";
import { IReview } from "@/types/review.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditReviewModal from "./EditReviewModal";
import Link from "next/link"; // 🎯 Added for detail navigation
import {
  deleteReviewAction,
  toggleLikeAction,
} from "@/app/_actions/review.action";

export default function UserReviewCard({ review }: { review: IReview }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: handleLike } = useMutation({
    mutationFn: () => toggleLikeAction(review.id),
    onSuccess: (res: any) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      }
    },
  });

  const triggerDeleteConfirmation = () => {
    toast.warning("Erase this critique?", {
      description: "This action is permanent and cannot be undone.",
      icon: <AlertTriangle className="size-4 text-rose-500/80" />, // 🎯 Subtler icon
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res: any = await deleteReviewAction(review.id);
            if (res.success) {
              toast.success("Review deleted successfully");
              queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            } else {
              toast.error(res.message);
            }
          } catch (error) {
            toast.error("Temporal error: Failed to delete review");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      // 🎯 THE FIX: Clean, standard-weight text and color transitions
      classNames: {
        toast:
          "bg-[#080808] border border-white/10 text-white rounded-2xl shadow-2xl p-5",
        title: "text-white font-bold text-sm tracking-tight", // 🎯 Reduced size and tracking
        description: "text-white/40 text-[11px] font-medium", // 🎯 Removed italic/bold mix
        // 🚀 Action Button (Delete) - Smooth color transition without jittery scale
        actionButton: cn(
          "bg-rose-600 text-white font-bold text-[11px] px-4 py-2 rounded-lg transition-all duration-300 ease-out",
          "transform-gpu will-change-transform", // 🎯 Forces GPU for smoothness
          "hover:bg-rose-500 hover:shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:-translate-y-0.5", // 🎯 Glow & Lift
          "active:scale-95", // 🎯 Physical feedback on click
        ),
        // 🛡️ Cancel Button - Simple ghost style
        cancelButton:
          "text-white/30 hover:text-white font-bold text-[11px] px-4 py-2 transition-colors duration-200",
      },
    });
  };

  const detailHref = `/dashboard/my-reviews/${review.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full transition-all duration-500"
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[2.5rem] opacity-0 blur-3xl transition-opacity duration-1000",
          isHovered ? "opacity-10 bg-primary" : "opacity-0",
        )}
      />

      <div className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#050505]/40 transition-colors duration-500 hover:bg-[#0a0b0d]/80 hover:border-white/10">
        {/* 🚀 CLICKABLE ZONE: Link to Detail Page */}
        <Link
          href={detailHref}
          className="flex flex-col flex-1 p-8 pb-0 gap-5 z-10 outline-none"
        >
          <div className="flex items-start justify-between relative">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.25em]">
                <Clapperboard className="size-3" />
                <span>CineMania Critic</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                {review.media?.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground/40">
                <Calendar className="size-3" />
                <span suppressHydrationWarning>
                  {typeof window !== "undefined"
                    ? format(new Date(review.createdAt), "do MMM yyyy")
                    : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 border border-white/10 shadow-lg group-hover:border-yellow-500/30 transition-colors">
              <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-black text-white">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="relative flex-1">
            {review.isSpoiler && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-rose-500 border border-rose-500/20">
                <ShieldAlert className="size-3" /> Spoiler Alert
              </div>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground/70 group-hover:text-white/90 transition-colors duration-500 italic">
              ❝{review.content}❞
            </p>
          </div>
        </Link>

        {/* 📊 FOOTER ZONE: Interactive elements separate from Link */}
        <div className="p-8 pt-0 space-y-6">
          {/* 🏷️ Tags Area - Refactored for Style & Performance */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {review.tags.map((tag) => (
                <div
                  key={tag}
                  className={cn(
                    "group/tag relative flex items-center gap-1.5 px-3 py-1 rounded-lg",
                    "bg-white/[0.02] border border-white/5",
                    "text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/50",
                    "transition-all duration-300 ease-out cursor-default",
                    // 🎯 THE FIX: Sophisticated single-layer hover
                    "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                    "hover:shadow-[0_0_20px_rgba(225,29,72,0.15)]",
                    // 🎯 THE FIX: Subtle lift instead of scale to prevent pixel jitter
                    "transform-gpu will-change-transform hover:-translate-y-0.5",
                  )}
                >
                  <Hash
                    className={cn(
                      "size-2.5 opacity-30 transition-all duration-300",
                      "group-hover/tag:opacity-100 group-hover/tag:rotate-12",
                    )}
                  />
                  <span className="relative z-10">{tag}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
            <div className="flex items-center gap-5">
              <button
                onClick={() => handleLike()}
                className="flex items-center gap-2 group/icon cursor-pointer outline-none"
              >
                <Heart
                  className={cn(
                    "size-4 transition-all duration-300",
                    review.likeCount > 0
                      ? "text-primary fill-primary"
                      : "text-muted-foreground/30 group-hover/icon:text-primary",
                  )}
                />
                <span className="text-xs font-bold text-muted-foreground group-hover/icon:text-white">
                  {review.likeCount}
                </span>
              </button>

              <Link
                href={detailHref}
                className="flex items-center gap-2 group/icon cursor-pointer"
              >
                <MessageSquare className="size-4 text-muted-foreground/30 group-hover:icon:text-primary transition-colors" />
                <span className="text-xs font-bold text-muted-foreground group-hover/icon:text-white">
                  {review.commentCount}
                </span>
              </Link>
            </div>

            <div className="relative flex items-center justify-end">
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-full mr-4 flex items-center gap-1.5"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditOpen(true);
                      }}
                      className="p-2.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDeleteConfirmation();
                      }}
                      className="p-2.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 shadow-sm",
                  review.status === "APPROVED"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-500",
                )}
              >
                {review.status}
              </div>
            </div>
          </div>
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
