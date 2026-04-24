"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  LayoutDashboard,
  Compass,
  Receipt,
  Copy,
  Check,
  Mail,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionSummary } from "@/services/payment.services";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Assuming you still have sonner installed!

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
};

export default function PaymentSuccessContent({
  sessionId,
}: {
  sessionId: string | null;
}) {
  const [hasCopied, setHasCopied] = useState(false);

  const { data: subData, isLoading } = useQuery({
    queryKey: ["subscriptionSummary"],
    queryFn: getSubscriptionSummary,
  });

  const planName = subData?.data?.plan || "PREMIUM";

  const handleCopy = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId);
    setHasCopied(true);
    toast.success("Session ID copied to clipboard");

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030406] text-white p-6">
      {/* 🌌 Ambient Emerald Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg"
      >
        {/* 🏆 Premium Glass Panel */}
        <div className="rounded-[3rem] bg-[#0a0c10] border border-emerald-500/20 p-8 sm:p-12 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] relative overflow-hidden">
          {/* Subtle Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

          {/* 1. Success Icon */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse" />
              <div className="size-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative z-10 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="size-10 text-emerald-400" />
              </div>
            </div>
          </motion.div>

          {/* 2. Text Content */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4 mb-10"
          >
            <h1 className="flex items-center justify-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              Transaction Verified
            </h1>
            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter drop-shadow-xl text-white">
              Access <span className="text-white/40">Granted.</span>
            </h2>

            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Your cinematic journey is now unrestricted. Welcome to the{" "}
              {isLoading ? (
                <span className="inline-block w-12 h-4 bg-white/10 animate-pulse rounded align-middle" />
              ) : (
                <span
                  className={cn(
                    "font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                    planName === "PRO" && "bg-indigo-500/20 text-indigo-400",
                    planName === "PREMIUM" && "bg-amber-500/20 text-amber-400",
                    planName === "BASIC" && "bg-blue-500/20 text-blue-400",
                  )}
                >
                  {planName}
                </span>
              )}{" "}
              tier of the CineMania ecosystem.
            </p>
          </motion.div>

          {/* 3. Session Reference Data & Email Notice */}
          {sessionId && (
            <motion.div
              variants={itemVariants}
              className="mb-10 transform-gpu will-change-transform [backface-visibility:hidden] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 relative group">
                <div className="flex items-center gap-3 min-w-0 pr-8">
                  <Receipt className="size-4 text-white/20 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">
                      Session Reference
                    </p>
                    <p className="text-xs font-mono text-emerald-500/80 truncate select-all">
                      {sessionId}
                    </p>
                  </div>
                </div>

                {/* 🎯 Interactive Copy Button */}
                <button
                  onClick={handleCopy}
                  className="absolute right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-muted-foreground hover:text-white"
                  title="Copy Session ID"
                >
                  {hasCopied ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>

              {/* 📧 Email Notification Hint */}
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Mail className="size-3 text-emerald-500/60" />
                Receipt sent to your inbox
              </div>
            </motion.div>
          )}

          {/* 4. Navigation Actions */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-600 text-white font-black uppercase text-[11px] tracking-widest overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] transform-gpu [backface-visibility:hidden]"
            >
              <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform-gpu" />
              <LayoutDashboard className="size-4 relative z-10" />
              <span className="relative z-10">Enter Dashboard</span>
            </Link>

            <Link
              href="/discovery"
              className="group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase text-[11px] tracking-widest transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95 transform-gpu [backface-visibility:hidden]"
            >
              <Compass className="size-4 text-muted-foreground group-hover:text-white transition-colors" />
              <span>Explore Network</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
