import ChangePasswordForm from "@/components/modules/dashboard/user-dashboard/change-password/ChangePasswordForm";
import { ShieldCheck, Fingerprint, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSecurityPage() {
  return (
    <div
      className={cn(
        "max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out",
      )}
    >
      {/* 🚀 HEADER */}
      <header className="flex flex-col gap-2 mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
          System{" "}
          <span className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            Security
          </span>
        </h1>
        <div className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] relative">
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </span>
          Authentication & Access Keys
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 🛡️ PROTOCOL SIDEBAR - Matte Stealth Design */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 transition-colors duration-700 hover:border-emerald-500/20">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)] opacity-50" />

            {/* Reactive Hover Glow (Smooth fade, no movement) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* Content */}
            <div className="relative z-10 p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3 text-emerald-500">
                  <ShieldCheck className="size-5" />
                  <h3 className="font-black uppercase tracking-widest text-xs text-white">
                    Protocol <span className="text-emerald-500">Alert</span>
                  </h3>
                </div>
                <Fingerprint className="size-4 text-white/10" />
              </div>

              <div className="space-y-4">
                <p className="text-xs leading-relaxed text-white/50 font-medium tracking-wide">
                  As a System Administrator, your credentials guard the
                  integrity of the entire Nexus.
                </p>
                <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 text-[10px] leading-relaxed text-emerald-400/80 font-bold tracking-wider uppercase">
                  Routine key rotation is heavily advised to prevent
                  unauthorized uplinks. Use complex, alphanumeric keyphrases.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔑 FORM CONTAINER - Tactical Vault Reveal */}
        <div className="lg:col-span-8">
          <div className="relative group rounded-[2.5rem] bg-[#050505] border border-white/5 overflow-hidden transition-all duration-700 hover:border-white/10 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)]">
            {/* Animated Top Accent Laser (Expands from center on hover) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-500 group-hover:w-2/3 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(16,185,129,1)]" />

            {/* Subtle Diagonal Sweep Gradient */}
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            {/* Macro-mesh Terminal Grid Reveal */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                {/* Icon subtly reacts to the container hover */}
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors duration-500">
                  <Lock className="size-4 text-white/40 group-hover:text-emerald-400 transition-colors duration-500" />
                </div>
                <h2 className="text-sm font-black text-white/60 uppercase tracking-widest group-hover:text-white/90 transition-colors duration-500">
                  Encryption Key Update
                </h2>
              </div>

              {/* The existing form drops perfectly in here */}
              <div className="w-full relative z-20">
                <ChangePasswordForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
