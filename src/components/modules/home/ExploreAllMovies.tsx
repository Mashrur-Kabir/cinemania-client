"use client";

/**
 * ExploreAllMovies — framer-motion removed
 * ─────────────────────────────────────────
 * The black background issue was caused by framer-motion animating
 * `x` from 0 to -1920 — a fixed pixel value. At viewports wider than
 * 1920px the strip ends before covering the row, revealing the #030406
 * background through the gap.
 *
 * Fix: pure CSS `animation: marquee` / `marquee-reverse` which are already
 * defined in globals.css. The strip width is percentage-based via flex,
 * so it always covers regardless of viewport size.
 */

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
  // Triple to ensure the loop never reveals the end
  const row = [
    ...(mediaItems || []),
    ...(mediaItems || []),
    ...(mediaItems || []),
  ];

  return (
    <HomeSection
      title="EXPLORE THE MULTIVERSE"
      subtitle="A never-ending stream of stories waiting to be told."
    >
      <div className="relative w-full overflow-hidden py-6">
        {/* Row 1 — left */}
        <div className="flex mb-6 pause-on-hover">
          <div className="flex gap-5 animate-marquee pause-on-hover shrink-0">
            {row.map((media, idx) => (
              <div
                key={`r1-${media.id}-${idx}`}
                className="w-[180px] flex-shrink-0"
              >
                <MediaCard media={media} />
              </div>
            ))}
          </div>
          {/* Duplicate strip for seamless loop */}
          <div
            className="flex gap-5 animate-marquee pause-on-hover shrink-0"
            aria-hidden
          >
            {row.map((media, idx) => (
              <div
                key={`r1b-${media.id}-${idx}`}
                className="w-[180px] flex-shrink-0"
              >
                <MediaCard media={media} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="flex pause-on-hover">
          <div className="flex gap-5 animate-marquee-reverse pause-on-hover shrink-0">
            {row.map((media, idx) => (
              <div
                key={`r2-${media.id}-${idx}`}
                className="w-[180px] flex-shrink-0"
              >
                <MediaCard media={media} />
              </div>
            ))}
          </div>
          <div
            className="flex gap-5 animate-marquee-reverse pause-on-hover shrink-0"
            aria-hidden
          >
            {row.map((media, idx) => (
              <div
                key={`r2b-${media.id}-${idx}`}
                className="w-[180px] flex-shrink-0"
              >
                <MediaCard media={media} />
              </div>
            ))}
          </div>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030406] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030406] to-transparent z-10" />
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/media"
          className="group relative flex items-center gap-3 px-10 py-4 rounded-full bg-white/5 border border-white/10 overflow-hidden transition-[border-color,background-color] duration-500 hover:border-primary/50 hover:bg-primary/5"
        >
          <span className="relative z-10 font-black text-xs tracking-[0.2em] text-white uppercase">
            Access Full Multiverse
          </span>
          <ChevronRight className="relative z-10 size-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </HomeSection>
  );
}
