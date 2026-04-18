"use client";

import { useQuery } from "@tanstack/react-query";
import { getFollowers, getFollowing } from "@/services/user.services";
import UserFollowCard from "./UserFollowCard";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { Users } from "lucide-react";
import Pagination from "@/components/shared/pagination/Pagination";
import { IFollowData } from "@/types/follow.types";

export default function FollowerList({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  // 🎯 THE FIX: Include 'page' in the queryKey and queryFn
  const { data: followersResponse, isLoading: loadingFollowers } = useQuery({
    queryKey: ["followers", userId, page],
    queryFn: () => getFollowers(userId, { page, limit: 10 }),
  });

  const { data: following, isLoading: loadingFollowing } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId),
  });

  if (loadingFollowers || loadingFollowing) {
    return <SectionSkeleton count={4} className="grid-cols-1 md:grid-cols-2" />;
  }

  const followers = followersResponse?.data || [];
  const meta = followersResponse?.meta; // 🎯 Extract meta from response

  if (!followers.length) {
    return (
      <div className="...">
        <Users className="size-12 mb-4" />
        <p className="font-black uppercase tracking-widest">No followers yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* 🎯 THE FIX: Add Pagination Control */}
      {meta && meta.totalPages > 1 && (
        <div className="pt-6">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
