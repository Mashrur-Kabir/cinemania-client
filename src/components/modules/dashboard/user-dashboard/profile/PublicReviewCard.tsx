/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IReview } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import {
  Star,
  MessageSquare,
  Heart,
  Clapperboard,
  Quote,
  Flag,
  AlertTriangle,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  toggleLikeAction,
  reportReviewAction,
} from "@/app/_actions/review.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000";

export default function PublicReviewCard({
  review,
  currentUserId,
}: {
  review: IReview;
  currentUserId?: string;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const posterSrc = review.media?.posterUrl || POSTER_FALLBACK;
  const mediaTitle = review.media?.title || "Unknown Media";
  const userName = review.user?.name || "this user";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { mutate: handleLike, isPending: isLikePending } = useMutation({
    mutationFn: () => toggleLikeAction(review.id),
    onSuccess: (res: any) => {
      if (res.success) router.refresh();
      else toast.error(res.message || "Failed to interact with critique.");
    },
    onError: () => toast.error("You must be logged in to endorse critiques."),
  });

  const { mutate: handleReport, isPending: isReportPending } = useMutation({
    mutationFn: () => reportReviewAction(review.id, reportReason),
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success(res.message);
        setIsReportOpen(false);
        setReportReason("");
      } else {
        toast.error(res.message);
      }
    },
  });

  return (
    <>
      <div className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 transition-all duration-500 hover:bg-[#0a0a0a] hover:border-primary/30 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(225,29,72,0.1)] outline-none transform-gpu will-change-transform">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="p-6 flex flex-col flex-1 gap-6 relative z-10">
          <Link
            href={`/media/${review.media?.slug}`}
            className="flex gap-5 items-start outline-none group/media"
          >
            <div className="relative h-24 w-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg group-hover/media:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all">
              <Image
                src={posterSrc}
                alt={mediaTitle}
                fill
                sizes="64px"
                className="object-cover transform-gpu will-change-transform [backface-visibility:hidden] group-hover/media:scale-110 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="space-y-2 min-w-0 pt-1">
              <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
                <Clapperboard className="size-3" />
                <span>Transmission</span>
              </div>
              <h3 className="text-lg font-black text-white truncate uppercase tracking-tight group-hover/media:text-primary transition-colors">
                {mediaTitle}
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <span>
                  {formatDistanceToNow(new Date(review.createdAt))} ago
                </span>
                <span className="size-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star className="size-3 fill-current" />
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>

          <Link
            href={`/reviews/${review.id}`}
            className="relative flex-1 outline-none group/text"
          >
            <Quote className="absolute -left-2 -top-2 size-6 text-white/5 transition-transform group-hover/text:-translate-y-1 duration-500" />
            <p className="text-[14px] leading-relaxed text-white/70 italic font-medium line-clamp-3 group-hover/text:text-white/90 transition-colors pl-1">
              ❝{review.content}❞
            </p>
          </Link>

          <div className="flex items-center justify-between pt-5 border-t border-white/5">
            <div className="flex items-center gap-5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLike();
                }}
                disabled={isLikePending}
                className="flex items-center gap-2 text-[11px] font-black text-muted-foreground/50 group-hover:text-rose-500 transition-colors outline-none cursor-pointer disabled:opacity-50"
              >
                <Heart
                  className={cn(
                    "size-3.5 transition-colors",
                    review.likeCount > 0 && "fill-current text-rose-500",
                  )}
                />
                {review.likeCount}
              </button>
              <Link
                href={`/reviews/${review.id}`}
                className="flex items-center gap-2 text-[11px] font-black text-muted-foreground/50 group-hover:text-sky-400 transition-colors outline-none"
              >
                <MessageSquare className="size-3.5" />
                {review.commentCount}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* 🎯 THE LOGIC & STYLING FIX: High visibility pill that shows 'disabled' if it's your own review */}
              {currentUserId === review.userId ? (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                  title="Cannot report own transmission"
                >
                  <Flag className="size-3.5 opacity-50" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Self
                  </span>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsReportOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/20 transition-all outline-none"
                  title="Report Transmission"
                >
                  <Flag className="size-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Report
                  </span>
                </button>
              )}

              <Link
                href={`/reviews/${review.id}`}
                className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-colors outline-none"
              >
                Read Log
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 THE FIX: Added mounted && before createPortal to prevent hydration crash */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isReportOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 md:p-10 pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => !isReportPending && setIsReportOpen(false)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-md bg-[#0a0c10] rounded-[2rem] border border-rose-500/20 overflow-hidden shadow-2xl shadow-rose-500/10"
                >
                  <div className="p-8 space-y-6">
                    <div className="space-y-2 text-center">
                      <div className="mx-auto size-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 shadow-[inset_0_0_20px_rgba(225,29,72,0.2)]">
                        <AlertTriangle className="size-5 text-rose-500" />
                      </div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                        Report Transmission
                      </h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Flagging review by {userName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                        Reason for Report
                      </label>
                      <textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="Spam, hate speech, severe spoilers without warning..."
                        className="w-full min-h-[100px] bg-black/50 border border-rose-500/20 rounded-xl p-4 text-sm text-white focus:border-rose-500/50 outline-none transition-all placeholder:text-rose-500/30 resize-none"
                        autoFocus
                        disabled={isReportPending}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setIsReportOpen(false)}
                        disabled={isReportPending}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!reportReason.trim() || isReportPending}
                        onClick={() => handleReport()}
                        className={cn(
                          "flex-[2] py-3 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-rose-500/50",
                          "hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95",
                        )}
                      >
                        {isReportPending ? "Sending..." : "Submit Report"}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => !isReportPending && setIsReportOpen(false)}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition"
                    disabled={isReportPending}
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
