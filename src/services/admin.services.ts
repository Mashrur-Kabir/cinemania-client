"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IQueryOptions } from "./user.services";
import { IReview } from "@/types/review.types";
import { IUser } from "@/types/user.types";

/**
 * 📊 UNIFIED ADMIN STATS
 * Matches the merged backend structure for System Nexus.
 */
export interface IAdminStats {
  platform: {
    totalUsers: number;
    totalPremiumUsers: number;
    totalMedia: number;
    totalRevenue: number;
  };
  engagement: {
    totalReviews: number;
    pendingReviewsCount: number;
    activeSubscriptions: number;
  };
  topContent: {
    mostWatched: { title: string; views: number } | null;
    highestRated: { title: string; rating: number } | null;
  };
  revenueData: {
    date: string;
    amount: number;
  }[];
  growthRate: number;
}

// 🎯 Name synced with AdminDashboardPage
export const getAdminStats = async () => {
  return httpClient.get<IAdminStats>("/profile/admin/stats");
};

export const getPendingReviews = async (params?: IQueryOptions) => {
  return httpClient.get<IReview[]>("/review/admin/pending", { params });
};

export const getAllUsers = async (params?: IQueryOptions) => {
  return httpClient.get<IUser[]>("/user", { params });
};
