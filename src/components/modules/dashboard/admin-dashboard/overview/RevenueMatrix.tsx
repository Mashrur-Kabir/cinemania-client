"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueData {
  date: string;
  amount: number;
}

export default function RevenueMatrix({ data }: { data: RevenueData[] }) {
  const totalInCycle = data.reduce((acc, curr) => acc + curr.amount, 0);

  // 🎯 Deterministic timeline calculation
  const synchronizedData = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];

    const existingEntry = data.find((entry) => entry.date === dateStr);
    return {
      date: dateStr,
      amount: existingEntry ? existingEntry.amount : 0,
    };
  });

  const maxRevenue = Math.max(...synchronizedData.map((d) => d.amount), 100);

  return (
    <div className="glass-panel p-8 space-y-8 border-white/5 bg-white/[0.01] relative overflow-hidden group/matrix">
      {/* 🌌 Ambient Glow */}
      <div className="absolute -top-24 -right-24 size-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.1)]">
            <DollarSign className="size-6 text-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              Revenue Flux <span className="text-primary/40">/</span>
              <span className="text-primary">
                ${totalInCycle.toLocaleString()}
              </span>
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
              Current 30-day financial synchronization
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 cursor-default"
        >
          <TrendingUp className="size-3 text-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 uppercase">
            +12.5% Growth
          </span>
        </motion.div>
      </div>

      {/* 📊 Visual Chart Area */}
      <div className="h-64 w-full flex items-end gap-0 group/chart overflow-x-auto chart-scrollbar-x pb-2">
        {synchronizedData.map((item, i) => {
          const heightPercent = (item.amount / maxRevenue) * 100;
          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center gap-3 h-full justify-end group/bar"
            >
              <div className="opacity-0 group-hover/bar:opacity-100 transition-all duration-300 translate-y-2 group-hover/bar:translate-y-0 flex flex-col items-center gap-0.5">
                <span className="text-[9px] font-bold text-primary/80 uppercase tracking-wide whitespace-nowrap">
                  {i === synchronizedData.length - 1
                    ? "Today"
                    : new Date(item.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                </span>
                <span className="text-[9px] font-bold text-white bg-black border border-white/10 px-2 py-1 rounded shadow-2xl whitespace-nowrap">
                  ${item.amount.toLocaleString()}
                </span>
              </div>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPercent, 2)}%` }}
                transition={{
                  delay: i * 0.015,
                  duration: 1,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className={cn(
                  "w-full rounded-t-[4px] relative transition-all duration-500",
                  "bg-gradient-to-t from-primary/5 via-primary/30 to-primary",
                  "hover:brightness-125 hover:shadow-[0_0_25px_rgba(225,29,72,0.6)]",
                  "transform-gpu will-change-[height]",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-white/20 rounded-full" />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 🧾 Bottom Legend */}
      <div className="flex justify-between pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
              Active Yield
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-white/10" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
              Projection
            </span>
          </div>
        </div>

        {/* 🎯 THE BEST FIX: Removed state/effect and added suppressHydrationWarning */}
        <p
          className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]"
          suppressHydrationWarning
        >
          Nexus Sync: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
