"use client";

import { motion, Variants } from "framer-motion"; // 🎯 Import Variants type
import { cn } from "@/lib/utils";
import { ICON_MAP } from "@/constants/static-icon-map";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  glowColor: string;
}

export default function StatCard({
  label,
  value,
  icon,
  color,
  glowColor,
}: StatCardProps) {
  const Icon = ICON_MAP[icon as keyof typeof ICON_MAP] || ICON_MAP.PlayCircle;

  // 🎯 Typing as 'Variants' automatically handles the "spring" literal requirement
  const parentVariants: Variants = {
    initial: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  const iconVariants: Variants = {
    initial: { rotate: 0, scale: 1, opacity: 0.7 },
    hover: {
      rotate: 12, // 🎯 Bumped to 12 for a more noticeable "Security" pop
      scale: 1.2,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={parentVariants}
      className="relative p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 cursor-default group overflow-hidden"
    >
      {/* 🔮 Background Bloom Effect */}
      <div
        className={cn(
          "absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none",
          "bg-gradient-to-br from-white/[0.05] to-transparent",
        )}
        style={{
          boxShadow: `inset 0 0 20px ${glowColor}15, 0 0 40px ${glowColor}10`,
        }}
      />

      {/* 🎯 Icon Motion Div */}
      <motion.div
        variants={iconVariants}
        className={cn("mb-4 inline-block origin-center", color)}
      >
        <Icon className="size-5" />
      </motion.div>

      <p className="relative z-10 text-3xl font-black text-white tracking-tight">
        {value}
      </p>

      <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-white/60 transition-colors mt-1">
        {label}
      </p>
    </motion.div>
  );
}
