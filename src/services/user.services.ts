"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  IWatchlistItem,
  IDiaryEntry,
  IUserStats,
  IActivityItem,
} from "@/types/dashboard.types";
import { IFollowData } from "@/types/follow.types";
import { IAchievement, IUserProfileStats } from "@/types/user.types";

// 🎯 Define a strict type for pagination/filter params
export interface IQueryOptions {
  page?: number;
  limit?: number;
  searchTerm?: string;
  [key: string]: string | number | boolean | undefined;
}

export const getUserStats = async () =>
  httpClient.get<IUserStats>("/watchedHistory/stats");

export const getWatchlist = async () =>
  httpClient.get<IWatchlistItem[]>("/watchlist");

export const getFollowingFeed = async () =>
  httpClient.get<IActivityItem[]>("/activity/feed");

export const getWatchedHistory = async (params?: IQueryOptions) =>
  httpClient.get<IDiaryEntry[]>("/watchedHistory", { params });

export const getFollowers = async (userId: string) =>
  httpClient.get<IFollowData[]>(`/follow/${userId}/followers`);

export const getFollowing = async (userId: string) =>
  httpClient.get<IFollowData[]>(`/follow/${userId}/following`);

export const getFollowStatus = async (userId: string) =>
  httpClient.get<{ isFollowing: boolean }>(`/follow/${userId}/status`);

export const getMyProfile = async () =>
  httpClient.get<IUserProfileStats>("/profile/me");

export const getAllAchievements = async () =>
  httpClient.get<IAchievement[]>("/achievements");
