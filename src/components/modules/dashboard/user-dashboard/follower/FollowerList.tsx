"use client";

import { useQuery } from "@tanstack/react-query";
import { getFollowers, getFollowing } from "@/services/user.services";
import UserFollowCard from "./UserFollowCard";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { SearchX, Users } from "lucide-react";
import Pagination from "@/components/shared/pagination/Pagination";
import { IFollowData } from "@/types/follow.types";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function FollowerList({
  userId,
  page,
  search,
}: {
  userId: string;
  page: number;
  search: string;
}) {
  const { data: followersResponse, isLoading: loadingFollowers } = useQuery({
    queryKey: ["followers", userId, page, search],
    // 🎯 THE FIX: Map 'search' to 'searchTerm' so the backend recognizes it
    queryFn: () =>
      getFollowers(userId, { page, limit: 10, searchTerm: search }),
  });

  // Query to check if the current user is following these followers back
  const { data: following, isLoading: loadingFollowing } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId, { limit: 1000 }), // Safety limit to ensure full cross-check
  });

  if (loadingFollowers || loadingFollowing) {
    return <SectionSkeleton count={4} className="grid-cols-1 md:grid-cols-2" />;
  }

  const followers = followersResponse?.data || [];
  const meta = followersResponse?.meta;

  if (!followers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.01]">
        <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          {/* 🎯 THE FIX: Dynamic empty state based on if they are searching */}
          {search ? (
            <SearchX className="size-8 text-primary/40" />
          ) : (
            <Users className="size-8 text-white/20" />
          )}
        </div>
        <p className="font-black uppercase tracking-[0.2em] text-[10px] text-white/40">
          No Inbound Signals
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">
          Your network grid is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {followers.map((item: IFollowData) => {
          const user = item.follower!;
          const isFollowingBack = following?.data?.some(
            (f: IFollowData) => f.followingId === user.id,
          );

          return (
            <UserFollowCard
              key={item.id}
              user={user}
              isFollowingMode={!!isFollowingBack}
            />
          );
        })}
      </motion.div>

      {meta && meta.totalPages > 1 && (
        <div className="pt-6">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
