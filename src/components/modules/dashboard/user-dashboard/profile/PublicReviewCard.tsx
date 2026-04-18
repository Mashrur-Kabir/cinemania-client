import { IReview } from "@/types/review.types";
import { format } from "date-fns";
import {
  Star,
  MessageSquare,
  Heart,
  Clapperboard,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 🎯 THE FIX: Define a valid fallback URL
const POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000";

export default function PublicReviewCard({ review }: { review: IReview }) {
  // 🎯 THE FIX: Ensure src is NEVER an empty string
  const posterSrc = review.media?.posterUrl || POSTER_FALLBACK;
  const mediaTitle = review.media?.title || "Unknown Media";

  return (
    <Link
      href={`/reviews/${review.id}`}
      className="group relative block transition-all duration-500 hover:-translate-y-1"
    >
      <div className="glass-panel relative flex flex-col gap-6 overflow-hidden rounded-[2rem] p-6 border border-white/5 bg-[#050505]/40 hover:bg-[#0a0b0d]/80 hover:border-white/10 transition-colors">
        {/* 🎬 Media Header */}
        <div className="flex gap-4 items-start">
          <div className="relative h-24 aspect-[2/3] rounded-xl overflow-hidden border border-white/5 shrink-0">
            <Image
              src={posterSrc}
              alt={mediaTitle}
              fill
              sizes="100px"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-primary font-black text-[8px] uppercase tracking-widest">
              <Clapperboard className="size-3" />
              <span>Transmission</span>
            </div>
            <h3 className="text-lg font-black text-white truncate uppercase tracking-tighter">
              {review.media?.title}
            </h3>
            <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground/60 uppercase">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {format(new Date(review.createdAt), "MMM yyyy")}
              </span>
              <span className="flex items-center gap-1 text-yellow-500/80">
                <Star className="size-3 fill-current" />
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* 📝 Critique Body */}
        <p className="text-[13px] leading-relaxed text-white/60 italic line-clamp-3">
          ❝{review.content}❞
        </p>

        {/* 📊 Engagement Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/40">
            <Heart className="size-3.5" /> {review.likeCount}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/40">
            <MessageSquare className="size-3.5" /> {review.commentCount}
          </div>
        </div>
      </div>
    </Link>
  );
}
