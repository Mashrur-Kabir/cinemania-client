// src/components/modules/dashboard/profile/ProfileStatsGrid.tsx
import { getMyProfile } from "@/services/user.services";
import { PlayCircle, Clock, MessageSquare, Users } from "lucide-react";

export default async function ProfileStatsGrid() {
  const { data } = await getMyProfile();
  const { overview } = data;

  const stats = [
    {
      label: "Movies Logged",
      value: overview.totalWatched,
      icon: PlayCircle,
      color: "text-primary",
    },
    {
      label: "Minutes Watched",
      value: overview.totalMinutes,
      icon: Clock,
      color: "text-amber-500",
    },
    {
      label: "Reviews Written",
      value: overview.reviewCount,
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      label: "Network Size",
      value: overview.followers + overview.following,
      icon: Users,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
        >
          <stat.icon
            className={`size-5 mb-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}
          />
          <p className="text-2xl font-black text-white tracking-tight">
            {stat.value}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
