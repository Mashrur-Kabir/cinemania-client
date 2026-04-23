/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IReview } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import {
  Star,
  MessageSquare,
  Heart,
  Quote,
  Film,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toggleLikeAction } from "@/app/_actions/review.action"; // 🎯 Ensure this path matches your project
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000";

export default function CommunityReviewCard({ review }: { review: IReview }) {
  const router = useRouter();
  const posterSrc = review.media?.posterUrl || POSTER_FALLBACK;
  const mediaTitle = review.media?.title || "Unknown Media";
  const userName = review.user?.name || "Anonymous";

  // 🎯 THE FIX: Mutation to handle the like action
  const { mutate: handleLike, isPending } = useMutation({
    mutationFn: () => toggleLikeAction(review.id),
    onSuccess: (res: any) => {
      if (res.success) {
        // 🚀 Force Next.js to quietly refetch the Server Component data in the background
        router.refresh();
      } else {
        toast.error(res.message || "Failed to interact with critique.");
      }
    },
    onError: () => {
      toast.error("You must be logged in to endorse critiques.");
    },
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-[2.5rem] bg-[#0a0b0e] border border-white/5 transition-all duration-500",
        "transform-gpu will-change-transform [backface-visibility:hidden]",
        "hover:border-primary/30 hover:bg-[#0c0d12] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(225,29,72,0.1)]",
      )}
    >
      <div className="p-6 md:p-8 flex flex-col flex-1 space-y-6 z-10">
        {/* 👤 ZONE 1: The Social Header (User & Rating) */}
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/profile/${review.userId}`}
            className="flex items-center gap-3 group/user outline-none"
          >
            <Avatar className="size-10 border border-white/10 group-hover/user:border-primary/50 transition-colors">
              <AvatarImage src={review.user?.image} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-sm font-black text-white uppercase tracking-tight group-hover/user:text-primary transition-colors">
                {userName}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                {formatDistanceToNow(new Date(review.createdAt))} ago
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 shrink-0">
            <Star className="size-3 fill-yellow-500 text-yellow-500" />
            <span className="text-[11px] font-black text-yellow-500">
              {review.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* 📝 ZONE 2: The Critique (The Voice) */}
        <Link
          href={`/reviews/${review.id}`}
          className="block flex-1 outline-none group/text"
        >
          <div className="relative">
            <Quote className="absolute -left-2 -top-3 size-8 text-primary/10 -z-10 transition-transform group-hover/text:-translate-y-1 group-hover/text:-rotate-6 duration-500" />
            {review.isSpoiler && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-[8px] font-black uppercase tracking-widest text-rose-500 animate-pulse">
                <ShieldAlert className="size-3" /> Spoiler Alert
              </span>
            )}
            <p className="text-[15px] leading-relaxed text-white/80 italic font-medium line-clamp-4 group-hover/text:text-white transition-colors">
              {review.content}
            </p>
          </div>
        </Link>

        {/* 🎬 ZONE 3: Rich Media Attachment (The Movie) */}
        <Link
          href={`/media/${review.media?.slug}`}
          className="block outline-none group/media"
        >
          <div className="relative flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 group-hover/media:border-white/15 group-hover/media:bg-white/[0.04] transition-all overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative h-16 w-12 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-md group-hover/media:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
              <Image
                src={posterSrc}
                alt={mediaTitle}
                fill
                sizes="48px"
                // 🎯 THE FIX: Added will-change-transform and [backface-visibility:hidden]
                className="object-cover transform-gpu will-change-transform [backface-visibility:hidden] transition-transform duration-700 ease-out group-hover/media:scale-110"
              />
            </div>

            <div className="flex-1 min-w-0 pr-2 space-y-1">
              <div className="flex items-center gap-1.5 text-primary/60 font-black text-[8px] uppercase tracking-widest">
                <Film className="size-2.5" /> Logged Subject
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tighter truncate group-hover/media:text-primary transition-colors">
                {mediaTitle}
              </h4>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                {review.media?.releaseYear} • {review.media?.platform}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* 📊 ZONE 4: Social Engagement Footer */}
      <div className="px-6 md:px-8 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          {/* 🎯 THE FIX: Wired up the Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevents bubbling if clicked weirdly near links
              handleLike();
            }}
            disabled={isPending}
            className="flex items-center gap-2 group/stat outline-none cursor-pointer disabled:opacity-50 transition-opacity"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                // Dynamically fill the heart if it has likes
                review.likeCount > 0
                  ? "text-rose-500 fill-rose-500"
                  : "text-muted-foreground/50 group-hover/stat:text-rose-500",
              )}
            />
            <span className="text-[11px] font-black text-muted-foreground/60 group-hover/stat:text-white transition-colors">
              {review.likeCount}
            </span>
          </button>

          <Link
            href={`/reviews/${review.id}`}
            className="flex items-center gap-2 group/stat outline-none"
          >
            <MessageSquare className="size-4 text-muted-foreground/50 group-hover/stat:text-sky-400 transition-colors" />
            <span className="text-[11px] font-black text-muted-foreground/60 group-hover/stat:text-white transition-colors">
              {review.commentCount}
            </span>
          </Link>
        </div>

        {/* Read More Indicator */}
        <Link
          href={`/reviews/${review.id}`}
          className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors"
        >
          Expand
        </Link>
      </div>
    </div>
  );
}
