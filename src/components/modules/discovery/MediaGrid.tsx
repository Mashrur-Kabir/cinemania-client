// src/components/modules/dashboard/discovery/MediaGrid.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import Link from "next/link";
import { TMediaPreview } from "@/types/media.types";
import { cn } from "@/lib/utils";

interface MediaGridProps {
  items: TMediaPreview[];
  className?: string;
}

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -10 }}
          className="group relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02]"
        >
          <Image
            src={item.posterUrl || ""}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Neon Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content Layer */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
              {item.releaseYear}
            </p>
            <h3 className="text-lg font-black text-white leading-tight mb-4">
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
          <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
            <Star className="size-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-white">
              {item.averageRating}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
