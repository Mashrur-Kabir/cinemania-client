import { getMyAdminProfile } from "@/services/admin.services";
import {
  ShieldCheck,
  Server,
  Activity,
  Key,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function AdminProfilePage() {
  const { data: profile } = await getMyAdminProfile();

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      {/* 🚀 HEADER */}
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
          System{" "}
          <span className="text-primary drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
            Identity
          </span>
        </h1>
        {/* 🎯 HYDRATION FIX: Swapped <p> to <div> since it contains structural elements */}
        <div className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          Secure Connection Established
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🛡️ IDENTITY MATRIX (Left Column) */}
        <div className="lg:col-span-4 relative group">
          {/* Ambient Glow behind card */}
          <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-1000 pointer-events-none" />

          <div
            className={cn(
              "glass-panel p-8 rounded-[2.5rem] border-primary/20 bg-black/40 backdrop-blur-xl relative overflow-hidden h-full flex flex-col",
              "transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(225,29,72,0.15)]",
            )}
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />

            <div className="flex flex-col items-center text-center space-y-6 flex-1 justify-center">
              <div className="relative size-36 rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out">
                {profile.user.image ? (
                  <Image
                    src={profile.user.image}
                    alt={profile.user.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldAlert className="size-12 text-primary/40 group-hover:text-primary transition-colors duration-500" />
                  </div>
                )}
                {/* Holographic Scanline */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-[200%] animate-scan pointer-events-none opacity-50 mix-blend-overlay" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                  {profile.user.name}
                </h2>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                  {profile.user.email}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 w-full pt-6 border-t border-white/5">
                <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]">
                  <ShieldCheck className="size-3.5" /> {profile.user.role}
                </span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/60 uppercase tracking-widest">
                  Status:{" "}
                  <span className="text-white">{profile.user.status}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 🖥️ OPERATIONAL DATA (Right Column) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Security Clearance Strip */}
          <div
            className={cn(
              "glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] flex items-center justify-between group cursor-default",
              "hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500",
            )}
          >
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/60 transition-colors">
                Security Clearance
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {profile.systemAccess.clearanceLevel}
              </h3>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-white/20 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-2xl">
              <Key className="size-8" />
            </div>
          </div>

          {/* 2x2 Action Queue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            {/* Pending Moderations */}
            <div
              className={cn(
                "glass-panel p-8 rounded-[2rem] border-amber-500/10 bg-amber-500/[0.02] flex flex-col justify-between group",
                "hover:bg-amber-500/10 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]",
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 group-hover:text-amber-400 transition-colors">
                  Pending
                  <br />
                  Moderations
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                  <Activity className="size-4 group-hover:animate-spin-slow" />
                </div>
              </div>
              <p className="text-5xl font-black text-white drop-shadow-md">
                {profile.actionQueue.pendingModerations}
              </p>
            </div>

            {/* Active Personnel */}
            <div
              className={cn(
                "glass-panel p-8 rounded-[2rem] border-cyan-500/10 bg-cyan-500/[0.02] flex flex-col justify-between group",
                "hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)]",
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500/70 group-hover:text-cyan-400 transition-colors">
                  Active
                  <br />
                  Personnel
                </span>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                  <Server className="size-4 group-hover:scale-110" />
                </div>
              </div>
              <p className="text-5xl font-black text-white drop-shadow-md">
                {profile.actionQueue.activeUsers}
              </p>
            </div>

            {/* Reported Transmissions */}
            <div
              className={cn(
                "glass-panel p-8 rounded-[2rem] border-rose-500/10 bg-rose-500/[0.02] flex flex-col justify-between group",
                "hover:bg-rose-500/10 hover:border-rose-500/30 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(225,29,72,0.2)]",
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/70 group-hover:text-rose-400 transition-colors">
                  Reported
                  <br />
                  Transmissions
                </span>
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                  <ShieldAlert className="size-4 group-hover:animate-pulse" />
                </div>
              </div>
              <p className="text-5xl font-black text-white drop-shadow-md">
                {profile.actionQueue.reportedReviews}
              </p>
            </div>

            {/* Modules Online */}
            <div
              className={cn(
                "glass-panel p-8 rounded-[2rem] border-purple-500/10 bg-purple-500/[0.02] flex flex-col justify-between group",
                "hover:bg-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.2)]",
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500/70 group-hover:text-purple-400 transition-colors">
                  Modules
                  <br />
                  Online
                </span>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                  <Cpu className="size-4 group-hover:rotate-12" />
                </div>
              </div>
              <p className="text-5xl font-black text-white drop-shadow-md">
                {profile.systemAccess.modulesActive}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
