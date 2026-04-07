"use client";

import { motion } from "framer-motion";
import { Film, Calendar, Zap } from "lucide-react";
import { IUserStats } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

export default function StatsOverview({ stats }: { stats: IUserStats }) {
  const cards = [
    {
      label: "Total Cinema",
      value: stats.totalMoviesWatched,
      icon: Film,
      color: "text-primary",
    },
    {
      label: "This Month",
      value: stats.watchedThisMonth,
      icon: Calendar,
      color: "text-accent",
    },
    {
      label: "Top Genre",
      value: Object.keys(stats.genreBreakdown)[0] || "None",
      icon: Zap,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-panel relative group p-6 overflow-hidden"
        >
          {/* Subtle Parallax Background Glow */}
          <div className="absolute -right-4 -top-4 size-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors duration-500" />

          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-2xl bg-white/5 border border-white/10 transition-transform duration-500 group-hover:rotate-12",
                card.color,
              )}
            >
              <card.icon className="size-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                {card.label}
              </p>
              <h3 className="text-2xl font-black text-white tracking-tighter capitalize">
                {typeof card.value === "number" ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {card.value}
                  </motion.span>
                ) : (
                  card.value
                )}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
