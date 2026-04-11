/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/dashboard/community/UserFollowCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { UserMinus, UserPlus } from "lucide-react";
import { IFollowUser } from "@/types/follow.types";
import { toggleFollowAction } from "@/app/_actions/user.action";

export default function UserFollowCard({
  user,
  isFollowingMode,
}: {
  user: IFollowUser;
  isFollowingMode: boolean;
}) {
  const queryClient = useQueryClient();

  const { mutate: handleToggle, isPending } = useMutation({
    mutationFn: () => toggleFollowAction(user.id),
    onSuccess: (res: any) => {
      toast.success(
        res.data.followed
          ? `Now following ${user.name}`
          : `Unfollowed ${user.name}`,
      );
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative flex items-center justify-between p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500"
    >
      <div className="flex items-center gap-4">
        <div className="relative size-14 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-black text-white uppercase tracking-tight text-sm">
            {user.name}
          </h4>
          <Badge
            variant="outline"
            className="mt-1 text-[8px] font-black uppercase border-white/5 bg-white/5 text-muted-foreground"
          >
            {user.role}
          </Badge>
        </div>
      </div>

      <button
        onClick={() => handleToggle()}
        disabled={isPending}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
          isFollowingMode
            ? "bg-white/5 text-white/50 hover:bg-rose-500/20 hover:text-rose-500 border border-white/5 hover:border-rose-500/50"
            : "bg-accent text-black hover:bg-accent/80"
        }`}
      >
        {isFollowingMode ? (
          <>
            <UserMinus className="size-3" /> Unfollow
          </>
        ) : (
          <>
            <UserPlus className="size-3" /> Follow Back
          </>
        )}
      </button>
    </motion.div>
  );
}
