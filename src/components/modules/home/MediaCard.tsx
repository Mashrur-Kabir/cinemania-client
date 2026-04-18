/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, PlayCircle, Heart, Eye } from "lucide-react";
import { TMediaPreview } from "@/types/media.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  media: TMediaPreview;
  priority?: boolean;
}

export default function MediaCard({ media, priority = false }: MediaCardProps) {
  const formatStat = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!media.streamingUrl) return;

    const isExternal =
      media.streamingUrl.startsWith("http") &&
      !media.streamingUrl.includes("yourdomain.com");

    if (isExternal) {
      window.open(media.streamingUrl, "_blank");
      return;
    }
  };

  return (
    <div className="group relative w-full">
      {/* 🎬 Poster (ONLY this is clickable for navigation) */}
      <Link
        href={`/media/${media.slug}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_-10px_rgba(225,29,72,0.4)]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 z-10" />

          {/* 🖼️ Poster */}
          <Image
            src={
              media.posterUrl ||
              "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
            }
            alt={media.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
          />

          {/* 🏷️ Top Badges */}
          <div className="absolute top-3.5 inset-x-3.5 z-30 flex items-center justify-between pointer-events-none">
            <Badge
              className={cn(
                "h-6 bg-black/60 backdrop-blur-md border-white/10 text-[9px] font-black uppercase tracking-widest px-2 flex items-center justify-center shadow-lg",
                media.pricing === "PRO" && "text-amber-400 border-amber-500/40",
                media.pricing === "PREMIUM" && "text-primary border-primary/40",
              )}
            >
              {media.pricing}
            </Badge>

            <div className="h-6 flex items-center gap-1.5 px-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-yellow-500 shadow-lg">
              <Star className="size-2.5 fill-current" />
              <span>
                {media.averageRating > 0
                  ? media.averageRating.toFixed(1)
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* 📊 Stats */}
          <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between text-white/70">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <Heart className="size-3 text-primary fill-primary/20" />
                {formatStat(media.likeCount ?? 0)}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <Eye className="size-3 text-accent" />
                {formatStat(media.viewCount ?? 0)}
              </div>
            </div>

            <span className="text-[9px] font-medium opacity-50 truncate max-w-[60px] uppercase tracking-tighter">
              {media.platform}
            </span>
          </div>
        </div>
      </Link>

      {/* ▶️ Play Button (Optimized for zero-jitter) */}
      {media.streamingUrl && (
        <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
          <button
            onClick={handlePlayClick}
            className={cn(
              "pointer-events-auto p-4 rounded-full border border-primary/40 text-white transition-all duration-300 ease-out",
              // 🎯 THE FIX: Hardware acceleration stack to stop the "blurring" jitter
              "transform-gpu will-change-transform [backface-visibility:hidden]",
              "hover:scale-110 active:scale-95 hover:bg-primary shadow-[0_0_30px_rgba(225,29,72,0.4)]",
              // 🎯 THE FIX: Use a static semi-transparent color instead of backdrop-blur to prevent redraw lag
              "bg-primary/20",
            )}
          >
            <PlayCircle className="size-10 fill-primary/20" />
          </button>
        </div>
      )}

      {/* 📝 Metadata */}
      <div className="mt-3 space-y-1 text-left px-1">
        <Link href={`/media/${media.slug}`}>
          <h3 className="truncate font-semibold font-heading text-sm text-white transition-colors group-hover:text-primary tracking-tight">
            {media.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-semibold">
          <span className="text-white/40">{media.releaseYear}</span>
          <span className="size-1 rounded-full bg-primary/40" />
          <span className="truncate uppercase tracking-tighter">
            {media.genres?.length
              ? media.genres
                  .map((g: any) => g?.genre?.name || g?.name)
                  .filter(Boolean)
                  .slice(0, 2)
                  .join(", ")
              : "Featured"}
          </span>
        </div>
      </div>
    </div>
  );
}
