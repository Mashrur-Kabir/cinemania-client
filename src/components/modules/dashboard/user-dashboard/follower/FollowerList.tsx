"use client";

import { useQuery } from "@tanstack/react-query";
import { getFollowers, getFollowing } from "@/services/user.services";
import UserFollowCard from "./UserFollowCard";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { Users } from "lucide-react";

export default function FollowerList({ userId }: { userId: string }) {
  // 1. Fetch Followers
  const { data: followers, isLoading: loadingFollowers } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId),
  });

  // 2. Fetch "Following" to determine if we follow them back (Mutual check)
  const { data: following, isLoading: loadingFollowing } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId),
  });

  if (loadingFollowers || loadingFollowing) {
    return <SectionSkeleton count={4} className="grid-cols-1 md:grid-cols-2" />;
  }

  if (!followers?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <Users className="size-12 mb-4" />
        <p className="font-black uppercase tracking-widest">No followers yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {followers.data.map((item) => {
        const user = item.follower!;
        // 🎯 Logic: If this follower's ID is in our 'Following' list, we follow them back.
        const isFollowingBack = following?.data?.some(
          (f) => f.followingId === user.id,
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
  );
}
