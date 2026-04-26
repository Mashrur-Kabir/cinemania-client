/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IQueryOptions } from "./user.services";
import { IReportedReview, IReview } from "@/types/review.types";
import { IUser, IUserAnalytics } from "@/types/user.types";
import {
  TUpdateUserRoleValues,
  TUpdateUserStatusValues,
} from "@/zod/user.validation";
import { ApiResponse } from "@/types/api.types";
import { IAdminProfileStats, IAdminStats } from "@/types/admin.types";

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

export const getMyAdminProfile = async () => {
  return httpClient.get<IAdminProfileStats>("/profile/admin/me");
};

export const getReportedReviews = async (params?: IQueryOptions) => {
  return httpClient.get<IReportedReview[]>("/review/reports/queue", { params });
};
