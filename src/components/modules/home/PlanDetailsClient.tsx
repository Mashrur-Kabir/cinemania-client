/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { initiatePayment } from "@/services/payment.services";
import { ShieldCheck, ArrowRight, Zap, Crown, ShieldAlert } from "lucide-react";
import { motion, Variants } from "framer-motion"; // 🎯 Added Variants type
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const PLAN_THEMES = {
  BASIC: {
    color: "text-blue-400",
    bg: "bg-blue-600",
    glow: "shadow-blue-500/40",
    icon: Zap,
    border: "border-blue-500/20",
  },
  PRO: {
    color: "text-amber-400",
    bg: "bg-amber-600",
    glow: "shadow-amber-500/40",
    icon: ShieldCheck,
    border: "border-amber-500/20",
  },
  PREMIUM: {
    color: "text-primary",
    bg: "bg-primary",
    glow: "shadow-primary/40",
    icon: Crown,
    border: "border-primary/20",
  },
};

// 🎯 FIX 2: Explicitly typing variants to resolve the 'ease' string assignment error
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function PlanDetailsClient({ plan }: { plan: string }) {
  // 🎯 FIX 1: Removed unused 'router' and 'X' imports/declarations
  const [isRedirecting, setIsRedirecting] = useState(false);
  const upperPlan = plan.toUpperCase() as keyof typeof PLAN_THEMES;
  const theme = PLAN_THEMES[upperPlan] || PLAN_THEMES.BASIC;
  const PlanIcon = theme.icon;

  const handleAction = async () => {
    setIsRedirecting(true);
    const toastId = toast.loading("Connecting to Stripe Gateway...");
    try {
      const res = await initiatePayment(upperPlan);
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      toast.error("Transmission Failed", { id: toastId });
      setIsRedirecting(false);
    }
  };

  const prices = { BASIC: "9.99", PRO: "19.99", PREMIUM: "29.99" };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-[#030406]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full glass-panel rounded-[3.5rem] border-white/5 relative overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >
        <div
          className={cn(
            "absolute top-0 right-0 p-24 opacity-5 pointer-events-none",
            theme.color,
          )}
        >
          <PlanIcon className="size-96" />
        </div>

        <div className="flex-1 p-12 md:p-16 space-y-10 relative z-10 border-r border-white/5">
          <motion.div variants={itemVariants} className="space-y-6">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border text-[10px] font-black uppercase tracking-[0.2em]",
                theme.border,
                theme.color,
              )}
            >
              <PlanIcon className="size-3" /> Digital Transmission Pending
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              {upperPlan} <span className={theme.color}>UPGRADE.</span>
            </h1>

            <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-md font-medium">
              Initialize your connection to the {upperPlan} frequency.
              High-fidelity access and priority status will be applied to your
              account instantly.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              onClick={handleAction}
              disabled={isRedirecting}
              className={cn(
                "group relative flex items-center gap-5 px-12 py-6 rounded-full font-black uppercase text-sm tracking-tighter text-white overflow-hidden transition-all duration-300",
                "transform-gpu will-change-transform [backface-visibility:hidden]",
                "hover:scale-105 active:scale-95",
                theme.bg,
                theme.glow,
                isRedirecting && "opacity-50 cursor-wait",
              )}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <span className="relative z-10 flex items-center gap-3">
                {isRedirecting ? "Syncing..." : "Initialize Transaction"}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-2" />
              </span>
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-start gap-4 p-5 rounded-3xl bg-rose-500/5 border border-rose-500/10 max-w-md"
          >
            <ShieldAlert className="size-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-500/80">
                Compliance Protocol
              </p>
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Transactions are final once the digital signal is established.
                Ensure your regional sector supports {upperPlan} playback before
                proceeding.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-[380px] p-12 bg-white/[0.01] flex flex-col justify-between relative z-10">
          <div className="space-y-10">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                Financial Matrix
              </h4>
              <div className="h-px w-full bg-white/10" />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Tier Selection
                </span>
                <span
                  className={cn(
                    "text-[11px] font-black uppercase tracking-widest",
                    theme.color,
                  )}
                >
                  {upperPlan}
                </span>
              </div>
              <div className="flex justify-between items-end text-3xl font-black italic text-white">
                <div className="flex flex-col">
                  <span className="not-italic font-bold text-[9px] text-muted-foreground uppercase tracking-[0.3em]">
                    Transmission Fee
                  </span>
                  <span className="text-sm font-bold text-white/40 not-italic">
                    Monthly
                  </span>
                </div>
                ${prices[upperPlan] || "0.00"}
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <ShieldCheck className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Gateway Secure
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground/70 font-medium">
                Standard 256-bit encryption active. Your session data is
                strictly ephemeral and handled via Stripe.
              </p>
            </div>
          </div>

          {/* 🎯 FIX 3: Wrapped comment-like text in a string literal to satisfy React/JSX rules */}
          <p className="text-[8px] text-white/20 uppercase font-black tracking-widest text-center mt-12 md:mt-0 italic">
            {"// CINEMANIA_PROTOCOL_v6.0"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
