// src/components/modules/dashboard/profile/TrophyCase.tsx
import { Trophy, Award } from "lucide-react";
import { format } from "date-fns";
import { IUserProfileStats } from "@/types/user.types";

export default async function TrophyCase({
  badges,
}: {
  badges: IUserProfileStats["badges"];
}) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="size-6 text-primary" />
          <h3 className="text-xl font-black uppercase tracking-tighter">
            Trophy Case
          </h3>
        </div>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          {badges.length} Unlocked
        </span>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex-shrink-0 w-32 flex flex-col items-center gap-3 group/trophy"
          >
            <div className="relative size-20 flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(225,29,72,0.1)] group-hover/trophy:scale-110 transition-transform duration-500">
              {/* 🎯 Logic: Map your badge.icon string to an actual SVG or Image */}
              <Award className="size-10 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-tight text-white line-clamp-1">
                {badge.name}
              </p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase">
                {format(new Date(badge.earnedAt), "MMM yyyy")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
