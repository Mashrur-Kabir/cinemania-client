/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IReviewDetail } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Star, Clapperboard, Heart, Quote } from "lucide-react";
import CommentSection from "@/components/modules/dashboard/user-dashboard/comments/CommentSection";
import { useMutation } from "@tanstack/react-query";
import { toggleLikeAction } from "@/app/_actions/review.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ReviewDetailView({
  review,
}: {
  review: IReviewDetail;
}) {
  const router = useRouter();
  const mediaTitle = review.media?.title || "Movie Poster";
  const userName = review.user?.name || "Anonymous Critic";
  const userRole = review.user?.role || "USER";

  // 🎯 Interactive Like Logic
  const { mutate: handleLike, isPending } = useMutation({
    mutationFn: () => toggleLikeAction(review.id),
    onSuccess: (res: any) => {
      if (res.success) {
        router.refresh(); // Quietly refresh the server component data
      } else {
        toast.error(res.message || "Failed to interact with critique.");
      }
    },
    onError: () => {
      toast.error("You must be logged in to endorse critiques.");
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      {/* 🎭 Cinematic Header (Static, no sudden jumps) */}
      <div className="relative h-[300px] w-full rounded-[3rem] overflow-hidden bg-[#050505] border border-white/5 shadow-2xl">
        {/* Parallax-style backdrop */}
        <div className="absolute inset-0">
          <Image
            src={review.media?.posterUrl || ""}
            alt={mediaTitle}
            fill
            className="object-cover opacity-15 blur-[40px] scale-110 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end">
          <div className="flex items-end gap-6 sm:gap-8">
            <div className="relative h-32 sm:h-40 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] shrink-0 z-10">
              <Image
                src={review.media?.posterUrl || ""}
                alt={mediaTitle}
                fill
                sizes="(max-width: 768px) 120px, 160px"
                className="object-cover"
              />
            </div>

            <div className="space-y-3 z-10 pb-2">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                <Clapperboard className="size-4" />
                <span>Logged Critique</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-lg">
                {mediaTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-black">
                  <Star className="size-3.5 fill-current" />
                  {review.rating.toFixed(1)}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {formatDistanceToNow(new Date(review.createdAt))} ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 The Critique Block */}
      <section className="relative px-8 sm:px-12 py-10 rounded-[3rem] bg-[#0c0d10] border border-white/5">
        <Quote className="absolute top-10 left-6 size-12 text-primary/5 -z-0" />

        <div className="relative z-10 mb-10">
          <p className="text-lg sm:text-xl leading-loose text-white/80 italic font-medium">
            ❝{review.content}❞
          </p>
        </div>

        {/* Action & Author Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-white/5 relative z-10">
          {/* Author Tag */}
          <div className="flex items-center gap-4">
            <div className="relative size-12 rounded-full overflow-hidden border border-white/10 bg-white/5">
              {review.user?.image ? (
                <Image
                  src={review.user.image}
                  alt={userName}
                  fill
                  // 🎯 THE FIX: Tell Next.js exactly how big this avatar is
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-primary text-xs uppercase">
                  {userName.substring(0, 2)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight">
                {userName}
              </p>
              {/* 🎯 THE FIX: Sleek Badge with forced hardware antialiasing */}
              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded border bg-primary/10 border-primary/20 shadow-[0_0_10px_rgba(225,29,72,0.1)] transform-gpu [backface-visibility:hidden]">
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.25em] antialiased leading-none pt-px">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Like Button */}
          <button
            onClick={() => handleLike()}
            disabled={isPending}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 active:scale-95 outline-none transform-gpu",
              isPending && "opacity-50 scale-95 cursor-wait",
              // 🎯 THE FIX: Use review.likeCount instead of review.likes.length
              review.likeCount > 0
                ? "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
                : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white",
            )}
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                // 🎯 THE FIX: Use review.likeCount
                review.likeCount > 0 && "fill-current",
              )}
            />
            <span className="text-[11px] font-black uppercase tracking-widest">
              {/* 🎯 THE FIX: Render review.likeCount */}
              {review.likeCount} Endorsements
            </span>
          </button>
        </div>
      </section>

      {/* 💬 Comment Section */}
      <div className="px-2">
        <CommentSection
          reviewId={review.id}
          initialComments={review.comments}
        />
      </div>
    </div>
  );
}
