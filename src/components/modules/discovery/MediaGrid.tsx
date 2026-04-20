"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import Link from "next/link";
import { TMediaPreview } from "@/types/media.types";
import { cn } from "@/lib/utils";

interface MediaGridProps {
  items: TMediaPreview[];
  className?: string;
}

// 🎯 THE FIX: Explicitly type variants for sub-pixel stability
const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function MediaGrid({ items, className }: MediaGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
        className,
      )}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          custom={i}
          variants={gridItemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -10 }}
          // 🎯 THE JITTER KILLER:
          // 1. Removed 'transition-all' (It fights with whileHover)
          // 2. Added 'transition-colors' (CSS only handles colors/borders now)
          // 3. Added 'perspective-1000' to the parent for 3D stability
          className={cn(
            "group relative aspect-[2/3] rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.02]",
            "transition-colors duration-500 hover:border-white/10 hover:bg-white/[0.04]",
            "transform-gpu will-change-transform [backface-visibility:hidden] [perspective:1000px]",
          )}
        >
          <Image
            src={item.posterUrl || ""}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 250px"
            className={cn(
              "object-cover transition-transform duration-700 ease-out group-hover:scale-110",
              // 🎯 THE FIX: Hardware acceleration for the image scale
              "transform-gpu [backface-visibility:hidden] will-change-transform",
            )}
          />

          {/* Neon Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {/* Content Layer */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 z-20">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
              {item.releaseYear}
            </p>
            <h3 className="text-lg font-black text-white leading-tight mb-4 truncate">
              {item.title}
            </h3>

            <Link
              href={`/media/${item.slug}`}
              className="w-full py-3 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-tighter flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.5)] active:scale-95 transition-all"
            >
              <Play className="size-3 fill-current" /> Watch Now
            </Link>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 z-20">
            <Star className="size-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-white">
              {item.averageRating > 0 ? item.averageRating.toFixed(1) : "N/A"}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
