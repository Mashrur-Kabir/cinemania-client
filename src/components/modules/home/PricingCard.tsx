// No framer-motion. No event handlers. Pure CSS transitions.
// This avoids both the "Event handlers cannot be passed to Client Component"
// error AND the transform-conflict jitter with ScrollReveal.
import { Check, Zap, ShieldCheck, Crown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PLAN_META = {
  BASIC: { icon: Zap, color: "text-blue-400" },
  PRO: { icon: ShieldCheck, color: "text-amber-400" },
  PREMIUM: { icon: Crown, color: "text-primary" },
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
    <div
      className={cn(
        "pricing-card group relative p-8 rounded-[2.5rem] overflow-hidden",
        "bg-white/[0.02] border border-white/5",
        // Hover state — pure CSS, no JS
        "hover:bg-white/[0.04] hover:border-white/10",
        // KEY: perspective in BASE state so hover never introduces
        // a new stacking context → eliminates the jitter
        "transition-[transform,box-shadow,border-color,background-color]",
        "duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "[transform:perspective(900px)_translate3d(0,0,0)]",
        "hover:[transform:perspective(900px)_translate3d(0,-10px,0)]",
        "will-change-transform",
      )}
    >
      {/* Sweep gradient on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon box */}
      <div
        className={cn(
          "relative z-10 size-12 rounded-2xl flex items-center justify-center mb-6",
          "bg-white/5 border border-white/10",
          "transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:rotate-12 group-hover:scale-110 will-change-transform",
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
            <Check className={cn("size-3.5 shrink-0", Meta.color)} />
            {f}
          </li>
        ))}
      </ul>

      <Link href={`/pricing/${type.toLowerCase()}`}>
        <button
          className={cn(
            "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]",
            "transition-[background-color,border-color,box-shadow,color]",
            "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "bg-white/5 text-white border border-white/10",
            "hover:bg-primary hover:border-primary hover:text-white",
            "hover:shadow-[0_0_28px_rgba(225,29,72,0.38)]",
          )}
        >
          Explore Access
        </button>
      </Link>
    </div>
  );
}
