// src/components/modules/home/ReviewCard.tsx
import { Star, Heart, MessageSquare, AlertTriangle } from "lucide-react";
import { IReview } from "@/types/review.types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ReviewCard({ review }: { review: IReview }) {
  // Utility for initials if image fails
  const userInitials = review.userId.substring(0, 2).toUpperCase();

  return (
    <div className="glass-panel group relative flex flex-col p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30">
      {/* 🔝 Header: User & Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-white/10 bg-white/5">
            {/* If your backend eventually provides user.image, it goes here */}
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="text-xs font-bold text-primary bg-transparent">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-bold text-white tracking-tight">
              CineManic User
            </p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <Star className="size-3 fill-current" />
          <span className="text-xs font-black">{review.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* 📝 Content */}
      <div className="relative flex-1">
        {review.isSpoiler && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase text-amber-500 tracking-widest">
            <AlertTriangle className="size-3" />
            Spoiler Alert
          </div>
        )}

        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground group-hover:text-white/90 transition-colors line-clamp-3",
            review.isSpoiler &&
              "blur-[4px] group-hover:blur-0 transition-all duration-500",
          )}
        >
          ❝{review.content}❞
        </p>
      </div>

      {/* 📊 Footer: Media Ref & Stats */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
          Media ID:{" "}
          <span className="text-accent">{review.mediaId.substring(0, 8)}</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1.5 group/stat">
            <Heart className="size-3.5 transition-colors group-hover/stat:text-primary group-hover/stat:fill-primary" />
            <span className="text-[11px] font-bold">{review.likeCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="size-3.5" />
            <span className="text-[11px] font-bold">{review.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
