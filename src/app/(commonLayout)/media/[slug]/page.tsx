import { getSingleMedia } from "@/services/media.services";
import Image from "next/image";
import { Play, Star, Calendar, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IGenre } from "@/types/media.types";
import { cn } from "@/lib/utils";
import QuickReviewModal from "@/components/modules/dashboard/user-dashboard/review/QuickReviewModal";

export default async function MediaDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: media } = await getSingleMedia(slug);
  if (!media) return null;

  return (
    <div className="relative min-h-screen">
      {/* 🎬 Cinematic Backdrop */}
      <div className="absolute inset-0 h-[75vh] z-0 overflow-hidden">
        <Image
          src={media.posterUrl || ""}
          alt={media.title}
          fill
          className="object-cover opacity-20 blur-2xl scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030406] via-[#030406]/90 to-transparent" />
      </div>

      {/* 🎯 THE FIX: 'items-center' ensures vertical symmetry between poster and text */}
      <div className="container relative z-10 mx-auto pt-32 px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left: Poster */}
        <div className="lg:col-span-4 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="relative aspect-[2/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] group">
            <Image
              src={media.posterUrl || ""}
              alt={media.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-8 space-y-10 animate-in fade-in slide-in-from-right-12 duration-1000">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {media.genres.map((g: IGenre) => (
                <Badge
                  key={g.id}
                  variant="outline"
                  className="text-primary border-primary/30 bg-primary/5 uppercase font-black tracking-widest text-[10px] px-4 py-1.5 rounded-lg"
                >
                  {g?.name || "Genre"}
                </Badge>
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.8] italic">
              {media.title}
            </h1>
          </div>

          <div className="flex items-center gap-10 text-white/50 font-black text-[11px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2.5 text-yellow-500">
              <Star className="size-4 fill-current" />{" "}
              <span>{media.averageRating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="size-4" /> {media.releaseYear}
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="size-4" /> {media.platform}
            </div>
          </div>

          <p className="text-lg text-muted-foreground/90 leading-relaxed max-w-2xl font-medium italic border-l-4 border-primary/20 pl-8">
            ❝{media.description}❞
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button
              className={cn(
                // 🎯 Layout & Standard Dimensions
                "group relative flex items-center gap-5 px-10 py-4 bg-primary rounded-full font-black uppercase tracking-tighter text-white text-sm overflow-hidden",
                // 🎯 Performance: GPU Acceleration & Jitter Prevention
                "transition-all duration-500 ease-out transform-gpu will-change-transform [backface-visibility:hidden] [perspective:1000px]",
                // 🎯 Hover Effects: Scaling & Dynamic Shadows
                "hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(225,29,72,0.4)] hover:shadow-[0_0_70px_rgba(225,29,72,0.6)]",
              )}
            >
              {/* ⚡ Cool Animation: Sliding Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              {/* 🎬 Icon Animation: Subtle Nudge & Pulse */}
              <Play className="size-6 fill-current transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              <span className="relative z-10">Watch Now</span>
            </button>

            {/* 🎯 NEW: Quick Review Modal beside Watch Now */}
            <QuickReviewModal media={media} />
          </div>
        </div>
      </div>
    </div>
  );
}
