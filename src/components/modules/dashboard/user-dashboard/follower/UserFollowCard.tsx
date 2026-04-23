/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { UserMinus, UserPlus } from "lucide-react";
import { IFollowUser } from "@/types/follow.types";
import { toggleFollowAction } from "@/app/_actions/user.action";
import { cn } from "@/lib/utils";
import Link from "next/link";

// 🎯 ANIMATION: These variants hook into the parent container's stagger setup!
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

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
          ? `Connection established with ${user.name}`
          : `Severed connection with ${user.name}`,
      );
      // Invalidate both to keep the entire network UI perfectly in sync
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "group relative flex items-center justify-between p-5 rounded-[2rem] bg-[#050505]",
        "border border-white/5 transition-all duration-500",
        "hover:bg-[#0a0a0a] hover:border-primary/30 hover:shadow-[0_0_30px_-10px_rgba(225,29,72,0.2)]",
      )}
    >
      {/* Ambient Hover Glow */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* 🎯 THE FIX: Clickable Link wrapper for Avatar and Name */}
      <Link
        href={`/profile/${user.id}`}
        className="flex items-center gap-4 relative z-10 flex-1 min-w-0 group/link outline-none"
      >
        <div className="relative size-14 rounded-2xl overflow-hidden border border-white/10 group-hover/link:border-primary/50 shadow-lg transition-colors duration-500 shrink-0">
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            fill
            sizes="56px"
            className="object-cover transform-gpu will-change-transform [backface-visibility:hidden] transition-transform duration-700 group-hover/link:scale-110"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="min-w-0 pr-4">
          <h4 className="font-black text-white uppercase tracking-tight text-sm truncate group-hover/link:text-primary transition-colors duration-300">
            {user.name}
          </h4>
          <Badge
            variant="outline"
            className="mt-1 text-[8px] font-black uppercase border-white/10 bg-white/[0.02] text-muted-foreground tracking-widest backdrop-blur-sm group-hover/link:bg-primary/10 group-hover/link:text-primary group-hover/link:border-primary/20 transition-colors duration-300"
          >
            {user.role}
          </Badge>
        </div>
      </Link>

      <button
        onClick={() => handleToggle()}
        disabled={isPending}
        className={cn(
          "relative z-10 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shrink-0 transform-gpu",
          isPending && "opacity-50 cursor-wait scale-95",
          isFollowingMode
            ? "bg-white/[0.03] text-white/50 border border-white/10 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(225,29,72,0.2)]"
            : "bg-accent text-black hover:bg-accent/80 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]",
        )}
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
