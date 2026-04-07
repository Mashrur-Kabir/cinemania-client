"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { IDiaryEntry } from "@/types/dashboard.types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Repeat, MessageSquareQuote } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function DiaryEntry({
  entry,
  index,
}: {
  entry: IDiaryEntry;
  index: number;
}) {
  const containerRef = useRef(null);

  // 🎭 Parallax Logic: The poster moves slower than the scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full min-h-[300px] mb-20 md:mb-32"
    >
      {/* 📍 Timeline Node */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        <div className="size-4 rounded-full bg-primary shadow-[0_0_15px_rgba(225,29,72,0.8)] border-4 border-[#030406]" />
        <div className="h-full w-px bg-gradient-to-b from-primary/50 to-transparent flex-1 min-h-[200px]" />
      </div>

      {/* 🎥 Content Card */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-6",
          isEven ? "md:text-right" : "md:flex-row-reverse md:text-left",
        )}
      >
        {/* 🖼️ Poster with Parallax Drift */}
        <div
          className={cn(
            "relative aspect-[2/3] w-full max-w-[240px] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-white/5",
            isEven ? "md:ml-auto" : "md:mr-auto md:order-last",
          )}
        >
          <motion.div
            style={{ y }}
            className="absolute inset-0 h-[120%] -top-[10%]"
          >
            <Image
              src={
                entry.media.posterUrl ||
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000"
              }
              alt={entry.media.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* 📝 Details */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ margin: "-100px" }}
          className="flex flex-col justify-center gap-3"
        >
          <div
            className={cn(
              "flex items-center gap-3 text-primary text-xs font-black tracking-widest uppercase",
              isEven ? "md:justify-end" : "md:justify-start",
            )}
          >
            <Calendar className="size-3" />
            {format(new Date(entry.watchedAt), "MMMM dd, yyyy")}
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
            {entry.media.title}
          </h3>

          <div
            className={cn(
              "flex flex-wrap gap-2 mt-2",
              isEven ? "md:justify-end" : "md:justify-start",
            )}
          >
            <Badge
              variant="outline"
              className="bg-white/5 border-white/10 text-white/60"
            >
              {entry.media.releaseYear}
            </Badge>
            {entry.isRewatch && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1">
                <Repeat className="size-3" /> REWATCH
              </Badge>
            )}
          </div>

          {entry.notes && (
            <div
              className={cn(
                "mt-4 p-4 rounded-xl bg-white/[0.03] border-l-2 border-primary italic text-sm text-muted-foreground leading-relaxed",
                isEven ? "text-right" : "text-left",
              )}
            >
              <MessageSquareQuote className="size-4 mb-2 opacity-20" />❝
              {entry.notes}❞
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
