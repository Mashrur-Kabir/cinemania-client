"use client";

import { motion } from "framer-motion";
import { Check, Zap, ShieldCheck, Crown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PLAN_META = {
  BASIC: { icon: Zap, color: "text-blue-400", glow: "shadow-blue-500/20" },
  PRO: {
    icon: ShieldCheck,
    color: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
  PREMIUM: { icon: Crown, color: "text-primary", glow: "shadow-primary/20" },
};

export default function PricingCard({
  type,
  price,
  features,
}: {
  type: "BASIC" | "PRO" | "PREMIUM";
  price: string;
  features: string[];
}) {
  const Meta = PLAN_META[type];

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 overflow-hidden"
    >
      {/* 🔮 Background Glow Sweep */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div
        className={cn(
          "relative z-10 size-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 transform-gpu transition-transform group-hover:rotate-12 group-hover:scale-110",
          Meta.color,
        )}
      >
        <Meta.icon className="size-6" />
      </div>

      <div className="space-y-1 mb-8">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
          {type} TIER
        </h3>
        <p className="text-4xl font-black text-white italic tracking-tighter">
          ${price}
          <span className="text-sm font-bold text-white/20 not-italic uppercase tracking-widest">
            /mo
          </span>
        </p>
      </div>

      <ul className="space-y-4 mb-10">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-[11px] font-bold text-white/60 uppercase tracking-wider"
          >
            <Check className={cn("size-3.5", Meta.color)} /> {f}
          </li>
        ))}
      </ul>

      <Link href={`/pricing/${type.toLowerCase()}`}>
        <button
          className={cn(
            "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 transform-gpu [backface-visibility:hidden]",
            "bg-white/5 text-white border border-white/10 hover:bg-primary hover:border-primary hover:text-white hover:shadow-[0_0_30px_rgba(225,29,72,0.4)]",
          )}
        >
          Explore Access
        </button>
      </Link>
    </motion.div>
  );
}
