"use client";

import { IReview } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import { Star, MessageSquare, Heart, Clapperboard, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000";

export default function PublicReviewCard({ review }: { review: IReview }) {
  const posterSrc = review.media?.posterUrl || POSTER_FALLBACK;
  const mediaTitle = review.media?.title || "Unknown Media";

  return (
    <Link
      href={`/reviews/${review.id}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 transition-all duration-500 hover:bg-[#0a0a0a] hover:border-primary/30 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(225,29,72,0.1)] outline-none transform-gpu will-change-transform"
    >
      {/* Subtle Top Gradient Glow on Hover */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="p-6 flex flex-col flex-1 gap-6 relative z-10">
        {/* 🎬 Media Header */}
        <div className="flex gap-5 items-start">
          <div className="relative h-24 w-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all">
            <Image
              src={posterSrc}
              alt={mediaTitle}
              fill
              sizes="64px"
              className="object-cover transform-gpu will-change-transform [backface-visibility:hidden] group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>

          <div className="space-y-2 min-w-0 pt-1">
            <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
              <Clapperboard className="size-3" />
              <span>Transmission</span>
            </div>
            <h3 className="text-lg font-black text-white truncate uppercase tracking-tight group-hover:text-primary transition-colors">
              {mediaTitle}
            </h3>

            <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              <span>{formatDistanceToNow(new Date(review.createdAt))} ago</span>
              <span className="size-1 rounded-full bg-white/10" />
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="size-3 fill-current" />
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* 📝 Critique Body */}
        <div className="relative flex-1">
          <Quote className="absolute -left-2 -top-2 size-6 text-white/5 transition-transform group-hover:-translate-y-1 duration-500" />
          <p className="text-[14px] leading-relaxed text-white/70 italic font-medium line-clamp-3 group-hover:text-white/90 transition-colors pl-1">
            ❝{review.content}❞
          </p>
        </div>

        {/* 📊 Engagement Stats */}
        <div className="flex items-center gap-5 pt-5 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground/50 group-hover:text-rose-500 transition-colors">
            <Heart
              className={cn(
                "size-3.5 transition-colors",
                review.likeCount > 0 && "fill-current text-rose-500",
              )}
            />
            {review.likeCount}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground/50 group-hover:text-sky-400 transition-colors">
            <MessageSquare className="size-3.5" />
            {review.commentCount}
          </div>

          <div className="ml-auto text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-colors">
            Read Log
          </div>
        </div>
      </div>
    </Link>
  );
}
