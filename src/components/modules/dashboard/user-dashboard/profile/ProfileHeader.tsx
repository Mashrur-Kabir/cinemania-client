"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Crown, Mail, ShieldCheck, Activity } from "lucide-react";
import { IUserProfileStats } from "@/types/user.types";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ProfileHeader({
  profile,
}: {
  profile: IUserProfileStats;
}) {
  const { user, subscription, overview } = profile;
  const avatarSrc = user.image || "/default-avatar.png";

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full rounded-[3rem] overflow-hidden bg-[#030406] border border-white/5 shadow-2xl"
    >
      {/* 🎭 Dynamic Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={avatarSrc}
          alt="cover blur"
          fill
          className="object-cover opacity-20 blur-[80px] saturate-[2] scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030406] via-[#030406]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030406] via-transparent to-transparent opacity-80" />
      </div>

      <div className="relative z-10 pt-32 pb-12 px-8 md:px-12 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
        {/* 👤 Premium Glowing Avatar */}
        <motion.div variants={itemVariants} className="relative group shrink-0">
          {/* Ambient outer glow */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-rose-500 to-amber-500 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />

          <div className="relative size-40 rounded-[2rem] overflow-hidden border-2 border-white/10 bg-[#030406] shadow-2xl">
            <Image
              src={avatarSrc}
              alt={user.name}
              fill
              priority
              sizes="160px"
              className="object-cover transform-gpu will-change-transform transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {subscription.isActive && (
            <div className="absolute -bottom-3 -right-3 size-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] border-4 border-[#030406] transform-gpu hover:scale-110 transition-transform">
              <Crown className="size-5 text-black drop-shadow-md" />
            </div>
          )}
        </motion.div>

        {/* 📝 Identity Details */}
        <div className="flex-1 space-y-6 pb-2">
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
              {user.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                <Mail className="size-3.5 text-primary" />
                {user.email}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                {user.status}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center md:justify-start gap-4 items-center"
          >
            <Badge
              className={cn(
                "px-5 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg border-none",
                subscription.isActive
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                  : "bg-white/10 text-white/50",
              )}
            >
              {subscription.plan} Member
            </Badge>

            <div className="flex items-center gap-6 px-6 py-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md shadow-inner">
              <div className="flex items-center gap-2 group cursor-pointer">
                <Activity className="size-4 text-primary/50 group-hover:text-primary transition-colors" />
                <span className="text-sm font-black text-white">
                  {overview.followers}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Followers
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="text-sm font-black text-white">
                  {overview.following}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Following
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
