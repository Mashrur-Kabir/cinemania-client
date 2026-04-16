// src/components/modules/dashboard/user-dashboard/profile/ProfileHeader.tsx
import Image from "next/image";
import { getMyProfile } from "@/services/user.services";
import { Badge } from "@/components/ui/badge";
import { Crown, Mail, ShieldCheck } from "lucide-react";
import { IUserProfileStats } from "@/types/user.types";

export default async function ProfileHeader({
  profile,
}: {
  profile: IUserProfileStats;
}) {
  const { user, subscription, overview } = profile;

  return (
    <header className="relative w-full rounded-[3rem] overflow-hidden bg-[#030406] border border-white/5 shadow-2xl">
      {/* 🎭 Cinematic Background/Banner */}
      <div className="absolute inset-0 h-48 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-50" />
      <div className="absolute inset-0 h-48 backdrop-blur-3xl" />

      <div className="relative pt-24 pb-10 px-10 flex flex-col md:flex-row items-end gap-8">
        {/* 👤 Glowing Avatar */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-rose-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative size-40 rounded-[2.2rem] overflow-hidden border-4 border-[#030406] bg-[#030406]">
            <Image
              src={user.image || "/default-avatar.png"}
              alt={user.name}
              fill
              priority
              // 🎯 THE FIX: Specify the exact width of the container
              sizes="160px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Active Status Ring */}
          {subscription.isActive && (
            <div className="absolute -bottom-2 -right-2 size-10 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.8)] border-4 border-[#030406]">
              <Crown className="size-5 text-white" />
            </div>
          )}
        </div>

        {/* 📝 Identity Details */}
        <div className="flex-1 space-y-4 pb-2">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              {user.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                <Mail className="size-3.5 text-primary" />
                {user.email}
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                {user.status}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.3)]">
              {subscription.plan} Member
            </Badge>

            <div className="flex items-center gap-6 px-6 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">
                  {overview.followers}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Followers
                </span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">
                  {overview.following}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Following
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
