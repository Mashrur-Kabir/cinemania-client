// src/app/(commonLayout)/explore-movies/[slug]/page.tsx
import { getSingleMedia } from "@/services/media.services";
import Image from "next/image";
import { Play, Star, Calendar, Globe } from "lucide-react"; // 🎯 Removed Clock
import { Badge } from "@/components/ui/badge";
import { IGenre } from "@/types/media.types";

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
      <div className="absolute inset-0 h-[70vh] z-0 overflow-hidden">
        <Image
          src={media.posterUrl || ""}
          alt={media.title}
          fill
          className="object-cover opacity-20 blur-md scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030406] via-[#030406]/80 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto pt-32 px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Poster Container with "Floating" animation */}
        <div className="lg:col-span-4 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="relative aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
            <Image
              src={media.posterUrl || ""}
              alt={media.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-8 flex flex-col justify-end pb-10 space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {/* 🎯 FIX: Correct genre mapping based on join-table response */}
              {media.genres.map((g: IGenre) => (
                <Badge
                  key={g.id}
                  variant="outline"
                  className="text-primary border-primary/20 bg-primary/5 uppercase font-black tracking-widest text-[9px] px-3 py-1"
                >
                  {g?.name || "Genre"}
                </Badge>
              ))}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              {media.title}
            </h1>
          </div>

          <div className="flex items-center gap-8 text-white/40 font-black text-[11px] uppercase tracking-widest">
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="size-4 fill-current" />
              <span>{media.averageRating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" /> {media.releaseYear}
            </div>
            <div className="flex items-center gap-2">
              <Globe className="size-4" /> {media.platform}
            </div>
          </div>

          <p className="text-xl text-muted-foreground/80 leading-relaxed max-w-2xl font-medium italic">
            ❝{media.description}❞
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button className="group flex items-center gap-4 px-12 py-5 bg-primary rounded-full font-black uppercase tracking-tighter text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(225,29,72,0.4)]">
              <Play className="size-5 fill-current group-hover:animate-pulse" />
              Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
