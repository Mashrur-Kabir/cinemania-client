/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IQueryOptions } from "./user.services";
import { IReview } from "@/types/review.types";
import { IUser, IUserAnalytics } from "@/types/user.types";
import {
  TUpdateUserRoleValues,
  TUpdateUserStatusValues,
} from "@/zod/user.validation";
import { ApiResponse } from "@/types/api.types";

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

// 🎯 THE FIX: Allow raw query string for Server-Managed Table
export const getAllUsers = async (
  query?: string | Record<string, any>,
): Promise<ApiResponse<IUser[]>> => {
  if (typeof query === "string") {
    return httpClient.get<IUser[]>(`/user?${query}`);
  }
  return httpClient.get<IUser[]>("/user", { params: query });
};

// 🛡️ USER MANAGEMENT MUTATIONS
export const updateUserRoleAction = async (
  id: string,
  payload: TUpdateUserRoleValues,
) => {
  return httpClient.patch<IUser>(`/user/${id}/role`, payload);
};

export const updateUserStatusAction = async (
  id: string,
  payload: TUpdateUserStatusValues,
) => {
  return httpClient.patch<IUser>(`/user/${id}/status`, payload);
};

export const deleteUserAction = async (id: string) => {
  return httpClient.delete(`/user/${id}`);
};

export const getUserAnalytics = async () => {
  return httpClient.get<IUserAnalytics>("/user/analytics");
};

export const getAdminArchive = async (params?: IQueryOptions) => {
  return httpClient.get<IReview[]>("/review/admin/archive", { params });
};
