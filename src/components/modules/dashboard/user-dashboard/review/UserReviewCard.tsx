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
} from "lucide-react";
import { IReview } from "@/types/review.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function UserReviewCard({ review }: { review: IReview }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full transition-all duration-500"
    >
      {/* 🌌 Background Glow - Refined for depth */}
      <div
        className={cn(
          "absolute inset-0 rounded-[2rem] opacity-0 blur-3xl transition-opacity duration-1000",
          isHovered ? "opacity-10 bg-primary" : "opacity-0",
        )}
      />

      <div className="glass-panel relative flex h-full flex-col gap-6 overflow-hidden rounded-[2rem] p-8 border border-white/5 bg-[#050505]/40 transition-colors duration-500 hover:bg-[#0a0b0d]/80 hover:border-white/10">
        {/* 🔦 Diagonal Spotlight Sweep (Fixed Logic) */}
        <div
          className={cn(
            "absolute -inset-[150%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent rotate-45 pointer-events-none",
            // 🎯 FIX: Reset instantly on unhover by using a conditional transition
            isHovered
              ? "translate-x-full translate-y-full transition-transform duration-[1500ms] ease-in-out"
              : "-translate-x-full -translate-y-full transition-none",
          )}
        />

        {/* 🔝 Header: Movie Info */}
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
        <div className="relative flex-1 py-1">
          {review.isSpoiler && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-rose-500 border border-rose-500/20 shadow-[0_0_15px_rgba(225,29,72,0.1)]">
              <ShieldAlert className="size-3" /> Spoiler Alert
            </div>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground/70 group-hover:text-white/90 transition-colors duration-500 italic">
            ❝{review.content}❞
          </p>
        </div>

        {/* 📊 Footer: Actions & Engagement */}
        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 group/icon cursor-pointer">
              <Heart
                className={cn(
                  "size-4 transition-colors duration-300",
                  isHovered
                    ? "text-primary fill-primary/20"
                    : "text-muted-foreground/30",
                )}
              />
              <span className="text-xs font-bold text-muted-foreground group-hover/icon:text-white">
                {review.likeCount}
              </span>
            </div>
            <div className="flex items-center gap-2 group/icon cursor-pointer">
              <MessageSquare
                className={cn(
                  "size-4 transition-colors duration-300",
                  isHovered ? "text-accent" : "text-muted-foreground/30",
                )}
              />
              <span className="text-xs font-bold text-muted-foreground group-hover/icon:text-white">
                {review.commentCount}
              </span>
            </div>
          </div>

          {/* 🎯 FIX: Actions container uses absolute positioning to prevent layout jitter */}
          <div className="relative flex items-center justify-end">
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  className="absolute right-full mr-3 flex items-center gap-1"
                >
                  <button
                    title="Edit"
                    className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-90"
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button
                    title="Delete"
                    className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all active:scale-90"
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
    </motion.div>
  );
}
