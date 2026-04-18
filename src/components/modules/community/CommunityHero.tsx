"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { IMedia } from "@/types/media.types";
import { Star, TrendingUp } from "lucide-react";

export default function CommunityHero({ media }: { media?: IMedia }) {
  const { scrollY } = useScroll();

  // 🎯 THE ZOOM: Image scales up from 1 to 1.2 as you scroll 500px
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  if (!media) return <div className="h-[70vh] bg-black" />;

  return (
    <div className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
      {/* 🖼️ Parallax Background Image */}
      <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
        <Image
          src={media.posterUrl || ""}
          alt={media.title}
          fill
          className="object-cover blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#030406]/60 to-[#030406]" />
      </motion.div>

      {/* 🏷️ Floating Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center space-y-6 max-w-4xl px-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(225,29,72,0.5)]">
          <TrendingUp className="size-3" /> Spotlight Broadcast
        </div>

        <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl">
          {media.title}
        </h1>

        <div className="flex items-center justify-center gap-8 text-white/60 font-black text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2 text-yellow-500">
            <Star className="size-4 fill-current" />{" "}
            {media.averageRating.toFixed(1)}
          </span>
          <span>{media.releaseYear}</span>
          <span>{media.platform}</span>
        </div>
      </motion.div>
    </div>
  );
}
