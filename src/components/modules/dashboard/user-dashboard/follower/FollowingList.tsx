"use client";

import { useQuery } from "@tanstack/react-query";
import { getFollowing } from "@/services/user.services";
import UserFollowCard from "./UserFollowCard";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { SearchX, UserPlus } from "lucide-react";
import Pagination from "@/components/shared/pagination/Pagination";
import { IFollowData } from "@/types/follow.types";
import { motion } from "framer-motion";

// 🎯 ANIMATION: The parent container triggers the cascade effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Cascades each card
    },
  },
};

export default function FollowingList({
  userId,
  page,
  search,
}: {
  userId: string;
  page: number;
  search: string;
}) {
  const { data: response, isLoading } = useQuery({
    queryKey: ["following", userId, page, search],
    // 🎯 THE FIX: Map 'search' to 'searchTerm'
    queryFn: () =>
      getFollowing(userId, { page, limit: 10, searchTerm: search }),
  });

  if (isLoading) {
    return <SectionSkeleton count={4} className="grid-cols-1 md:grid-cols-2" />;
  }

  const followingItems = response?.data || [];
  const meta = response?.meta;

  if (!followingItems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.01]">
        <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          {/* 🎯 THE FIX: Dynamic empty state based on if they are searching */}
          {search ? (
            <SearchX className="size-8 text-primary/40" />
          ) : (
            <UserPlus className="size-8 text-white/20" />
          )}
        </div>
        <p className="font-black uppercase tracking-[0.2em] text-[10px] text-white/40">
          No Outbound Connections
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">
          You aren&apos;t following anyone in this sector.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 🎯 Wraps the grid in the motion container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {followingItems.map((item: IFollowData) => (
          <UserFollowCard
            key={item.id}
            user={item.following!}
            isFollowingMode={true}
          />
        ))}
      </motion.div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
