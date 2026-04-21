/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserAnalytics } from "@/services/admin.services";
import { motion, Variants } from "framer-motion";
import { Users, ShieldAlert, Activity, Ban } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { useState } from "react";

const COLORS = {
  active: "#10b981", // Emerald
  blocked: "#f43f5e", // Rose
};

// 🌟 Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
          {label || payload[0].name}
        </p>
        <p className="text-sm font-bold text-white flex items-center">
          <span
            className="size-2 rounded-full mr-2 shadow-[0_0_8px_currentColor]"
            style={{
              backgroundColor: payload[0].payload.fill || "#06b6d4",
              color: payload[0].payload.fill || "#06b6d4",
            }}
          />
          {payload[0].value} {payload[0].value === 1 ? "User" : "Users"}
        </p>
      </div>
    );
  }
  return null;
};

// 🌟 Custom Legend for Pie Chart
const CustomLegend = ({ payload, onHover, onLeave }: any) => {
  if (!payload) return null;

  return (
    <ul className="flex flex-col gap-3 w-full mt-4">
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest cursor-pointer transition-opacity duration-300 hover:opacity-100"
          onMouseEnter={() => onHover(entry.value)}
          onMouseLeave={onLeave}
          style={{ color: entry.color }}
        >
          <span className="flex items-center gap-2 text-white/70">
            <div
              className="size-2.5 rounded-full shadow-[0_0_10px_currentColor]"
              style={{
                backgroundColor: entry.color,
                color: entry.color,
              }}
            />
            {entry.value}
          </span>
          <span className="text-white text-sm">{entry.payload?.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default function UserAnalyticsDashboard() {
  const [activePieSector, setActivePieSector] = useState<string | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["user-analytics"],
    queryFn: () => getUserAnalytics(),
  });

  const analytics = response?.data;

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-[350px] w-full bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const { overview, growthData, statusDistribution } = analytics;

  // 🎯 THE FIX: Inject the fill color directly into the data array to avoid using the deprecated <Cell> component
  const pieDataWithFill = statusDistribution.map((item) => ({
    ...item,
    fill: item.name === "Active" ? COLORS.active : COLORS.blocked,
    // Add opacity logic for interactive hover effect
    opacity:
      activePieSector === null || activePieSector === item.name ? 1 : 0.2,
  }));

  // 🎯 THE FIX: Explicitly type variants to satisfy Framer Motion requirements
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* 🚀 VITALITY METRICS (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Population",
            value: overview.totalUsers,
            icon: Users,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            shadow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
          },
          {
            label: "Active Clearances",
            value: overview.activeUsers,
            icon: Activity,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            shadow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
          },
          {
            label: "Blocked Entities",
            value: overview.blockedUsers,
            icon: Ban,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            shadow: "group-hover:shadow-[0_0_30px_rgba(225,29,72,0.15)]",
          },
          {
            label: "System Admins",
            value: overview.adminUsers,
            icon: ShieldAlert,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            shadow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            className={cn(
              "p-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 relative overflow-hidden group transition-all duration-500",
              stat.shadow,
            )}
          >
            <div
              className={cn(
                "absolute top-0 left-0 w-1 h-full transition-all duration-500 opacity-50 group-hover:opacity-100 group-hover:w-1.5",
                stat.bg,
              )}
            />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 group-hover:text-white/70 transition-colors">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
              </div>
              <div
                className={cn(
                  "p-3 rounded-xl border transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3",
                  stat.bg,
                  stat.border,
                  stat.color,
                )}
              >
                <stat.icon className="size-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📊 CHARTS SECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart (Growth) */}
        <motion.div
          variants={item}
          className="lg:col-span-2 p-6 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 shadow-lg relative overflow-hidden group"
        >
          {/* Subtle Background Glow on Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="mb-8 relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
              Registration Vector (6 Months)
            </h3>
          </div>

          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={growthData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(6,182,212,0.05)" }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#colorCyan)"
                  radius={[6, 6, 6, 6]}
                  barSize={40}
                  // Active Shape allows for interactive hover state on the bars
                  activeBar={{
                    fill: "url(#colorCyanActive)",
                    stroke: "rgba(6,182,212,0.5)",
                    strokeWidth: 1,
                  }}
                />
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorCyanActive"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right: Donut Charts (Demographics) */}
        <motion.div
          variants={item}
          className="p-8 rounded-2xl glass-panel bg-white/[0.01] border border-white/5 shadow-lg flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-6 text-center">
              Population Status
            </h3>

            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataWithFill}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    onMouseEnter={(_, index) =>
                      setActivePieSector(pieDataWithFill[index].name)
                    }
                    onMouseLeave={() => setActivePieSector(null)}
                    style={{ transition: "opacity 0.3s ease" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Dynamic Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.span
                  key={activePieSector || "total"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-3xl font-black text-white"
                >
                  {activePieSector
                    ? pieDataWithFill.find((d) => d.name === activePieSector)
                        ?.value
                    : overview.totalUsers}
                </motion.span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                  {activePieSector ? activePieSector : "Total"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6">
            <Legend
              content={(props) => (
                <CustomLegend
                  {...props}
                  onHover={setActivePieSector}
                  onLeave={() => setActivePieSector(null)}
                />
              )}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
