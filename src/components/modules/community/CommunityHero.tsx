"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { IMedia } from "@/types/media.types";
import { Star, TrendingUp, ChevronDown } from "lucide-react";

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
        className="relative z-10 text-center space-y-6 max-w-4xl px-6 -mt-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(225,29,72,0.5)]">
          <TrendingUp className="size-3" /> Spotlight Broadcast
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl">
          {media.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/60 font-black text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2 text-yellow-500 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <Star className="size-4 fill-current" />{" "}
            {media.averageRating.toFixed(1)}
          </span>
          <span>{media.releaseYear}</span>
          <span>•</span>
          <span>{media.platform}</span>
        </div>
      </motion.div>

      {/* 🎯 Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.3em]">
          Explore Feed
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
