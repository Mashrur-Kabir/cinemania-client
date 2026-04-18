"use client";

import { useQuery } from "@tanstack/react-query";
import { getFollowing } from "@/services/user.services";
import UserFollowCard from "./UserFollowCard";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import { UserPlus } from "lucide-react";
import Pagination from "@/components/shared/pagination/Pagination";
import { IFollowData } from "@/types/follow.types";

export default function FollowingList({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  // 🎯 THE FIX: Sync query with current page and set a consistent limit
  const { data: response, isLoading } = useQuery({
    queryKey: ["following", userId, page],
    queryFn: () => getFollowing(userId, { page, limit: 10 }),
  });

  if (isLoading) {
    return <SectionSkeleton count={4} className="grid-cols-1 md:grid-cols-2" />;
  }

  const followingItems = response?.data || [];
  const meta = response?.meta;

  if (!followingItems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <UserPlus className="size-12 mb-4" />
        <p className="font-black uppercase tracking-widest text-xs">
          You aren&apos;t following anyone
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 👥 User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followingItems.map((item: IFollowData) => (
          <UserFollowCard
            key={item.id}
            user={item.following!}
            isFollowingMode={true} // In this sector, these are active signals you follow
          />
        ))}
      </div>

      {/* 🔢 Pagination Control */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
