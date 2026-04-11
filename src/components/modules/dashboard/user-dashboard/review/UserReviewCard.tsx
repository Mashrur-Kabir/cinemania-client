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
  Hash, // 🎯 Added for tag visual
} from "lucide-react";
import { IReview } from "@/types/review.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditReviewModal from "./EditReviewModal";
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
      description:
        "This action is permanent and cannot be undone in this timeline.",
      icon: <AlertTriangle className="size-5 text-rose-500" />,
      duration: 5000,
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
      className:
        "bg-[#030406] border-white/10 text-white rounded-2xl shadow-2xl",
    });
  };

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

      <div className="glass-panel relative flex h-full flex-col gap-5 overflow-hidden rounded-[2.5rem] p-8 border border-white/5 bg-[#050505]/40 transition-colors duration-500 hover:bg-[#0a0b0d]/80 hover:border-white/10">
        <div
          className={cn(
            "absolute -inset-[150%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent rotate-45 pointer-events-none",
            isHovered
              ? "translate-x-full translate-y-full transition-transform duration-[1500ms] ease-in-out"
              : "-translate-x-full -translate-y-full transition-none",
          )}
        />

        {/* 🔝 Header */}
        <div className="flex items-start justify-between relative z-10">
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
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {format(new Date(review.createdAt), "do MMM yyyy")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 border border-white/10 shadow-lg group-hover:border-yellow-500/30 transition-colors">
            <Star className="size-3.5 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-white">
              {review.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* 📝 Content Body */}
        <div className="relative flex-1">
          {review.isSpoiler && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-rose-500 border border-rose-500/20">
              <ShieldAlert className="size-3" /> Spoiler Alert
            </div>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground/70 group-hover:text-white/90 transition-colors duration-500 italic">
            ❝{review.content}❞
          </p>

          {/* 🏷️ Tags Area */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {review.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[9px] font-bold text-muted-foreground/60 transition-all hover:border-accent/30 hover:text-accent"
                >
                  <Hash className="size-2.5 opacity-40" />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📊 Footer */}
        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
          <div className="flex items-center gap-5">
            <button
              onClick={() => handleLike()}
              className="flex items-center gap-2 group/icon cursor-pointer outline-none"
            >
              <Heart
                className={cn(
                  "size-4 transition-all duration-300",
                  review.likeCount > 0
                    ? "text-primary fill-primary shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    : "text-muted-foreground/30 group-hover/icon:text-primary",
                )}
              />
              <span className="text-xs font-bold text-muted-foreground group-hover/icon:text-white">
                {review.likeCount}
              </span>
            </button>

            <div className="flex items-center gap-2 group/icon">
              <MessageSquare className="size-4 text-muted-foreground/30" />
              <span className="text-xs font-bold text-muted-foreground">
                {review.commentCount}
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-end">
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  className="absolute right-full mr-4 flex items-center gap-1.5"
                >
                  <button
                    onClick={() => setIsEditOpen(true)}
                    title="Edit Review"
                    className="p-2.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90"
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button
                    onClick={triggerDeleteConfirmation}
                    title="Delete Review"
                    className="p-2.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all active:scale-90"
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
                  : "bg-amber-500/10 border-amber-500/30 text-amber-500 animate-pulse",
              )}
            >
              {review.status}
            </div>
          </div>
        </div>
      </div>

      <EditReviewModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        review={review}
      />
    </motion.div>
  );
}
