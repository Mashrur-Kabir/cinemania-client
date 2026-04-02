import Image from "next/image";
import Link from "next/link";
import { Star, PlayCircle, Heart, Eye } from "lucide-react";
import { IMedia } from "@/types/media.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  media: IMedia;
  priority?: boolean;
}

export default function MediaCard({ media, priority = false }: MediaCardProps) {
  // Utility to format large numbers (e.g., 1200 -> 1.2k)
  const formatStat = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
  };

  return (
    <Link
      href={`/media/${media.slug}`}
      className="group relative block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-transform duration-300 active:scale-95"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_-10px_rgba(225,29,72,0.4)]">
        {/* Subtle Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 z-10" />

        {/* 🖼️ Poster Image */}
        <Image
          src={
            media.streamingUrl ||
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
          }
          alt={media.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 15vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />

        {/* 🎬 Center Play Icon on Hover */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <div className="bg-primary/20 p-4 rounded-full border border-primary/40 scale-75 transition-transform duration-300 group-hover:scale-100">
            <PlayCircle className="size-10 text-white fill-primary/20" />
          </div>
        </div>

        {/* 🏷️ Top Left: Pricing Badge */}
        <div className="absolute top-3 left-3 z-30">
          <Badge
            className={cn(
              "bg-black/60 backdrop-blur-md border-white/10 text-[9px] font-black uppercase tracking-wider px-2 py-0.5",
              media.pricing === "PRO" && "text-amber-400 border-amber-500/30",
              media.pricing === "PREMIUM" && "text-primary border-primary/30",
            )}
          >
            {media.pricing}
          </Badge>
        </div>

        {/* ⭐ Top Right: Rating */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-yellow-500 shadow-xl">
          <Star className="size-3 fill-current" />
          {media.averageRating > 0 ? media.averageRating.toFixed(1) : "N/A"}
        </div>

        {/* 📊 Bottom Social Stats Layer */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between text-white/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <Heart className="size-3 text-primary fill-primary/20" />
              {formatStat(media.likeCount)}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <Eye className="size-3 text-accent" />
              {formatStat(media.viewCount)}
            </div>
          </div>
          {/* Platform Indicator */}
          <span className="text-[9px] font-medium opacity-50 truncate max-w-[60px] uppercase tracking-tighter">
            {media.platform}
          </span>
        </div>
      </div>

      {/* Metadata (Below Poster) */}
      <div className="mt-3 space-y-1 text-left px-1">
        <h3 className="truncate font-heading text-sm font-black text-white transition-colors group-hover:text-primary tracking-tight">
          {media.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-semibold">
          <span className="text-white/40">{media.releaseYear}</span>
          <span className="size-1 rounded-full bg-primary/40" />
          <span className="truncate uppercase tracking-tighter">
            {media.genres?.[0]?.name || "Featured"}
          </span>
        </div>
      </div>
    </Link>
  );
}
