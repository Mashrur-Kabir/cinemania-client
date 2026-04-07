"use client";

import { motion } from "framer-motion";
import { IActivityItem } from "@/types/dashboard.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function ActivityFeed({
  activities,
}: {
  activities: IActivityItem[];
}) {
  return (
    <div className="space-y-4">
      {activities.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
          className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
        >
          <Avatar className="size-10 border border-primary/20">
            <AvatarImage src={item.user.image || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {item.user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="text-sm text-white/90 leading-tight">
              <span className="font-bold text-white">{item.user.name}</span>{" "}
              <span className="text-muted-foreground">
                {item.summary.replace(item.user.name, "")}
              </span>
            </p>
            <p className="text-[10px] font-medium text-muted-foreground/50 uppercase mt-1">
              {formatDistanceToNow(new Date(item.createdAt))} ago
            </p>
          </div>

          <div className="size-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(225,29,72,1)]" />
        </motion.div>
      ))}
    </div>
  );
}
