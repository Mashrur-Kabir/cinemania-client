// src/components/modules/dashboard/profile/ProfileStatsGrid.tsx
import StatCard from "./StatCard";
import { IUserProfileStats } from "@/types/user.types";

export default async function ProfileStatsGrid({
  overview,
}: {
  overview: IUserProfileStats["overview"];
}) {
  const stats = [
    {
      label: "Movies Logged",
      value: overview.totalWatched,
      icon: "PlayCircle",
      color: "text-primary",
      glowColor: "#e11d48", // Rose-600
    },
    {
      label: "Minutes Watched",
      value: overview.totalMinutes,
      icon: "Clock",
      color: "text-amber-500",
      glowColor: "#f59e0b", // Amber-500
    },
    {
      label: "Reviews Written",
      value: overview.reviewCount,
      icon: "MessageSquare",
      color: "text-blue-500",
      glowColor: "#3b82f6", // Blue-500
    },
    {
      label: "Network Size",
      value: overview.followers + overview.following,
      icon: "Users",
      color: "text-emerald-500",
      glowColor: "#10b981", // Emerald-500
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
