"use client";

import { motion } from "framer-motion";
import MediaCard from "./MediaCard";
import { HomeSection } from "./HomeSection";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TMediaPreview } from "@/types/media.types";

export default function ExploreAllMovies({
  mediaItems,
}: {
  mediaItems: TMediaPreview[];
}) {
  // 🎯 Duplicate the items to create a seamless infinite loop
  const marqueeItems = [
    ...(mediaItems || []),
    ...(mediaItems || []),
    ...(mediaItems || []),
  ];

  return (
    <HomeSection
      title="EXPLORE THE MULTIVERSE"
      subtitle="A never-ending stream of stories waiting to be told."
    >
      <div className="relative w-full overflow-hidden py-10">
        {/* 🎭 Row 1: Moving Left */}
        <div className="flex mb-8">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40, // Adjust speed
                ease: "linear",
              },
            }}
            className="flex gap-6 hover:[animation-play-state:paused]"
          >
            {marqueeItems.map((media, idx) => (
              <div
                key={`${media.id}-row1-${idx}`}
                className="w-[200px] flex-shrink-0"
              >
                <MediaCard media={media} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* 🎭 Row 2: Moving Right (Offset for variety) */}
        <div className="flex">
          <motion.div
            animate={{ x: [-1920, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50, // Slightly different speed for parallax feel
                ease: "linear",
              },
            }}
            className="flex gap-6"
          >
            {marqueeItems.map((media, idx) => (
              <div
                key={`${media.id}-row2-${idx}`}
                className="w-[200px] flex-shrink-0"
              >
                <MediaCard media={media} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* 🌫️ Edge Fades: Cinematic depth */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#030406] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#030406] to-transparent z-10" />
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/media"
          className="group relative flex items-center gap-3 px-10 py-4 rounded-full bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:border-primary/50"
        >
          {/* Subtle button glow */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />

          <span className="relative z-10 font-black text-xs tracking-[0.2em] text-white uppercase">
            Access Full Multiverse
          </span>
          <ChevronRight className="relative z-10 size-4 text-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </HomeSection>
  );
}
