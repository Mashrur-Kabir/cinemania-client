import { IReviewDetail } from "@/types/review.types";
import { format } from "date-fns";
import Image from "next/image";
import { Star, Clapperboard, Calendar } from "lucide-react";
import CommentSection from "@/components/modules/dashboard/user-dashboard/comments/CommentSection";

export default function ReviewDetailView({
  review,
}: {
  review: IReviewDetail;
}) {
  const mediaTitle = review.media?.title || "Movie Poster";
  const userName = review.user?.name || "Anonymous Critic";
  const userRole = review.user?.role || "USER";

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🎭 Cinematic Header */}
      <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.02]">
        <Image
          src={review.media?.posterUrl || ""}
          alt={mediaTitle}
          fill
          sizes="(max-width: 768px) 100vw, 160px"
          className="object-cover opacity-20 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030406] via-transparent to-transparent" />

        <div className="absolute inset-0 p-10 flex items-end gap-8">
          <div className="relative h-40 aspect-[2/3] rounded-2xl overflow-hidden border border-primary/40 shadow-2xl shrink-0">
            <Image
              src={review.media?.posterUrl || ""}
              alt={mediaTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-3 pb-2">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Clapperboard className="size-4" />
              <span>Reviewing...</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              {mediaTitle}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground font-bold text-xs uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {format(new Date(review.createdAt), "MMMM yyyy")}
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5 text-yellow-500">
                <Star className="size-3.5 fill-current" />
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 The Critique */}
      <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 relative">
        <p className="text-xl leading-relaxed text-white/90 italic font-medium">
          ❝{review.content}❞
        </p>
        <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
          <div className="size-10 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center font-black text-primary text-xs uppercase">
            {userName.substring(0, 2)}
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase">
              {userName}
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {userRole}
            </p>
          </div>
        </div>
      </section>

      <CommentSection reviewId={review.id} initialComments={review.comments} />
    </div>
  );
}
