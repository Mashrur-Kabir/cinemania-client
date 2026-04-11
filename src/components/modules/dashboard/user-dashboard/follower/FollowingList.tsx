"use client";

import { useQuery } from "@tanstack/react-query";
import { getFollowing } from "@/services/user.services";
import UserFollowCard from "./UserFollowCard";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { UserPlus } from "lucide-react";

export default function FollowingList({ userId }: { userId: string }) {
  const { data: following, isLoading } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId),
  });

  if (isLoading) {
    return <SectionSkeleton count={4} className="grid-cols-1 md:grid-cols-2" />;
  }

  if (!following?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <UserPlus className="size-12 mb-4" />
        <p className="font-black uppercase tracking-widest">
          You aren&apos;t following anyone
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {following.data.map((item) => (
        <UserFollowCard
          key={item.id}
          user={item.following!}
          isFollowingMode={true} // In this tab, you are by definition following them
        />
      ))}
    </div>
  );
}
