"use client";

import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  Clapperboard,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IAdminStats } from "@/types/admin.types";

export default function AdminKpiGrid({ stats }: { stats: IAdminStats }) {
  const kpis = [
    {
      label: "Total Citizens",
      value: stats.platform.totalUsers,
      icon: Users,
      color: "text-blue-400",
      accent: "bg-blue-500",
      border: "hover:border-blue-500/50",
      shadow: "hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
    },
    {
      label: "Total Revenue",
      value: `$${stats.platform.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "text-emerald-400",
      accent: "bg-emerald-500",
      border: "hover:border-emerald-500/50",
      shadow: "hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
    },
    {
      label: "Multiverse Content",
      value: stats.platform.totalMedia,
      icon: Clapperboard,
      color: "text-amber-400",
      accent: "bg-amber-500",
      border: "hover:border-amber-500/50",
      shadow: "hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]",
    },
    {
      label: "Pending Reviews",
      value: stats.engagement.pendingReviewsCount,
      icon: MessageSquare,
      color: "text-rose-400",
      accent: "bg-rose-500",
      border: "hover:border-rose-500/50",
      shadow: "hover:shadow-[0_0_30px_-5px_rgba(225,29,72,0.3)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: i * 0.05,
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1],
          }}
          whileHover={{ y: -5 }} // Snappy upward lift
          className={cn(
            "glass-panel p-6 border border-white/5 relative group overflow-hidden transition-all duration-300",
            "bg-white/[0.01] hover:bg-white/[0.03]",
            kpi.border,
            kpi.shadow,
            "transform-gpu will-change-transform",
          )}
        >
          {/* 🔦 1. Spotlight Beam Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div
              className={cn(
                "absolute -top-[50%] -left-[50%] w-[200%] h-[200%] rotate-45 bg-[radial-gradient(circle,transparent_20%,rgba(255,255,255,0.03)_50%,transparent_70%)]",
                "group-hover:animate-[spin_10s_linear_infinite]",
              )}
            />
          </div>

          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                  {kpi.label}
                </p>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {kpi.value}
                </h3>
              </div>

              {/* 🔄 2. Rhythmic Icon Pulse */}
              <div className="relative">
                {/* Background Ring */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className={cn(
                    "absolute inset-0 rounded-xl blur-md",
                    kpi.accent,
                  )}
                />
                <div
                  className={cn(
                    "relative p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors duration-300",
                  )}
                >
                  <kpi.icon
                    className={cn(
                      "size-6 transition-transform duration-500 group-hover:scale-110",
                      kpi.color,
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 📈 3. Bottom Growth Indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "size-1.5 rounded-full animate-pulse shadow-[0_0_8px]",
                    kpi.accent,
                  )}
                />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Live Sync
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                <TrendingUp className="size-3" />
                <span>+{stats.growthRate}%</span>
              </div>
            </div>
          </div>

          {/* ⚡ 4. Accent Corner Notch */}
          <div
            className={cn(
              "absolute top-0 right-0 w-8 h-8 opacity-20 transition-all duration-500 group-hover:opacity-100",
              "bg-[linear-gradient(225deg,var(--tw-gradient-from)_0%,transparent_50%)]",
              kpi.accent.replace("bg-", "from-"),
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}
