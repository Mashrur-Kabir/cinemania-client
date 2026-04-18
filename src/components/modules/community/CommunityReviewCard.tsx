"use client";

import { IReview } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import {
  Star,
  MessageSquare,
  Heart,
  Quote,
  ArrowUpRight,
  Film,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000";

export default function CommunityReviewCard({ review }: { review: IReview }) {
  const posterSrc = review.media?.posterUrl || POSTER_FALLBACK;
  const mediaTitle = review.media?.title || "Unknown Media";
  const userName = review.user?.name || "Anonymous";

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-[2.5rem] bg-[#0c0d10]/60 border border-white/5 backdrop-blur-md transition-all duration-500",
        "transform-gpu will-change-transform [backface-visibility:hidden]",
        "hover:border-primary/30 hover:bg-[#0c0d10]/90 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(225,29,72,0.15)]",
      )}
    >
      {/* 🎬 ZONE 1: Movie Details Link */}
      <Link
        href={`/media/${review.media?.slug}`}
        className="relative h-48 w-full overflow-hidden block"
      >
        <Image
          src={posterSrc}
          alt={mediaTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="object-cover opacity-30 blur-sm scale-105 group-hover:scale-110 group-hover:blur-0 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/40 to-transparent" />

        {/* Floating Poster & Info */}
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={posterSrc}
                alt=""
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-1.5 text-primary font-black text-[8px] uppercase tracking-widest">
                <Film className="size-2.5" /> Movie Profile
              </div>
              <h3 className="text-lg font-black text-white leading-none uppercase tracking-tighter truncate max-w-[150px]">
                {mediaTitle}
              </h3>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-500/20 flex items-center gap-1.5 shadow-lg mb-1">
            <Star className="size-3 fill-yellow-500 text-yellow-500" />
            <span className="text-[11px] font-black text-white">
              {review.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>

      {/* 📝 ZONE 2: Review Details Link */}
      <Link
        href={`/reviews/${review.id}`}
        className="flex-1 flex flex-col group/review"
      >
        <div className="p-8 pt-6 flex-1 flex flex-col space-y-4">
          <div className="relative">
            <Quote className="absolute -left-2 -top-2 size-8 text-primary/10 -z-10" />
            <p className="text-[14px] leading-relaxed text-white/70 italic font-medium line-clamp-4 group-hover/review:text-white transition-colors">
              {review.content}
            </p>
          </div>

          <div className="flex-1" />

          {/* User Signal */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <Avatar className="size-8 border border-white/10">
                <AvatarImage src={review.user?.image} />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-white uppercase tracking-tight">
                  {userName}
                </p>
                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  {formatDistanceToNow(new Date(review.createdAt))} ago
                </p>
              </div>
            </div>

            <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover/review:bg-primary transition-all">
              <ArrowUpRight className="size-4 text-primary group-hover/review:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Engagement Matrix (Footer) */}
        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center gap-6">
          <div className="flex items-center gap-2 group/stat">
            <Heart className="size-3.5 text-muted-foreground/40 group-hover/review:text-rose-500 transition-colors" />
            <span className="text-[10px] font-black text-muted-foreground/40 group-hover/review:text-white transition-colors">
              {review.likeCount}
            </span>
          </div>
          <div className="flex items-center gap-2 group/stat">
            <MessageSquare className="size-3.5 text-muted-foreground/40 group-hover/review:text-sky-400 transition-colors" />
            <span className="text-[10px] font-black text-muted-foreground/40 group-hover/review:text-white transition-colors">
              {review.commentCount}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
