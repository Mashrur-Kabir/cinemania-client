"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Home, Compass, Radio } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030406] text-white">
      {/* 🌌 Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ⚠️ Massive Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/[0.02] tracking-tighter select-none pointer-events-none z-0">
        404
      </div>

      {/* 🎬 Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6"
      >
        {/* Radar Icon */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="size-20 rounded-[2rem] bg-white/[0.02] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/20 animate-pulse" />
            <Radio className="size-8 text-primary relative z-10" />
          </div>
        </motion.div>

        {/* Text Block */}
        <motion.div variants={itemVariants} className="space-y-4 mb-12">
          <h1 className="flex items-center justify-center gap-3 text-xs font-black text-primary uppercase tracking-[0.4em]">
            <span className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
            Dead End
          </h1>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter drop-shadow-2xl">
            Signal <span className="text-white/30">Lost.</span>
          </h2>
          <p className="text-base text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
            The cinematic frequency you are trying to intercept does not exist
            in this timeline. The sector may have been wiped or re-routed.
          </p>
        </motion.div>

        {/* Dual Call-To-Action */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/"
            className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-black uppercase text-[11px] tracking-widest overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(225,29,72,0.4)] transform-gpu will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform-gpu" />
            <Home className="size-4 relative z-10" />
            <span className="relative z-10">Return to Base</span>
          </Link>

          <Link
            href="/discovery"
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase text-[11px] tracking-widest transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95 transform-gpu [backface-visibility:hidden]"
          >
            <Compass className="size-4 text-muted-foreground group-hover:text-white transition-colors" />
            <span>Explore Network</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
