"use client";

import { useState } from "react";
import { Trophy, Award, Sparkles, X } from "lucide-react";
import { format } from "date-fns";
import { IUserProfileStats } from "@/types/user.types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function TrophyCase({
  badges,
}: {
  badges: IUserProfileStats["badges"];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedBadge = badges.find((b) => b.id === selectedId);

  return (
    <div className="p-8 rounded-[3rem] bg-[#050505] border border-white/5 relative group transition-colors duration-500 hover:border-white/10">
      {/* 🔮 Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[3rem]" />

      <div className="relative flex items-center justify-between mb-10 z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Trophy className="size-5 text-primary" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-white">
            Trophy Case
          </h3>
        </div>
        {/* 🎯 THE FIX: Added antialiased, transform-gpu, and backface-visibility to stop the font-weight jitter */}
        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(225,29,72,0.15)] antialiased transform-gpu [backface-visibility:hidden]">
          {badges.length} Unlocked
        </span>
      </div>

      {/* Horizontal Badge List */}
      <div className="relative z-10 flex gap-6 overflow-x-auto pb-6 pt-4 px-4 -mx-4 scrollbar-hide">
        {badges.length > 0 ? (
          badges.map((badge) => {
            const isSelected = selectedId === badge.id;
            const isDimmed = selectedId !== null && !isSelected;

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedId(isSelected ? null : badge.id)}
                className={cn(
                  "flex-shrink-0 w-28 flex flex-col items-center gap-5 group/trophy cursor-pointer outline-none transition-opacity duration-500",
                  isDimmed ? "opacity-40 hover:opacity-80" : "opacity-100",
                )}
              >
                {/* 🏆 Premium Badge Container */}
                <div
                  className={cn(
                    "relative size-24 flex items-center justify-center rounded-3xl border shadow-lg transition-all duration-500 ease-out transform-gpu will-change-transform [backface-visibility:hidden]",
                    isSelected
                      ? "scale-110 border-primary/50 bg-primary/20 shadow-[0_0_40px_-10px_rgba(225,29,72,0.6)]"
                      : "bg-[#0c0d10] border-white/5 group-hover/trophy:scale-110 group-hover/trophy:border-primary/40 group-hover/trophy:bg-primary/10 group-hover/trophy:shadow-[0_0_40px_-10px_rgba(225,29,72,0.5)]",
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-2 rounded-2xl border transition-colors duration-500",
                      isSelected
                        ? "border-primary/30"
                        : "border-primary/0 group-hover/trophy:border-primary/20",
                    )}
                  />

                  <Award
                    className={cn(
                      "size-10 transition-all duration-500 transform-gpu",
                      isSelected
                        ? "text-primary scale-110"
                        : "text-white/20 group-hover/trophy:text-primary group-hover/trophy:scale-110",
                    )}
                  />
                </div>

                <div className="text-center space-y-1.5 w-full">
                  <p
                    className={cn(
                      "text-[11px] font-black uppercase tracking-tight transition-colors line-clamp-1 px-1",
                      isSelected
                        ? "text-primary"
                        : "text-white/80 group-hover/trophy:text-white",
                    )}
                  >
                    {badge.name}
                  </p>
                  <p
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-[0.2em] transition-colors",
                      isSelected
                        ? "text-primary/80"
                        : "text-muted-foreground/50 group-hover/trophy:text-primary/80",
                    )}
                  >
                    {format(new Date(badge.earnedAt), "MMM yyyy")}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full py-12 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <Award className="size-10 text-white/10 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
              No trophies unlocked yet
            </p>
          </div>
        )}
      </div>

      {/* 📝 Smooth Expanding Description Panel */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            key="description-panel"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden relative z-0"
          >
            <div className="mt-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 relative group/panel">
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">
                    {selectedBadge.name}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                    {/* Assuming badge.description exists. Fallback provided just in case! */}
                    {selectedBadge.description ||
                      "A rare cinematic achievement unlocked by displaying exceptional taste and dedication to the multiverse."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
