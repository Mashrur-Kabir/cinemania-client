"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  IWatchlistItem,
  IDiaryEntry,
  IUserStats,
  IActivityItem,
} from "@/types/dashboard.types";

export const getUserStats = async () =>
  httpClient.get<IUserStats>("/watchedHistory/stats");

export const getWatchlist = async () =>
  httpClient.get<IWatchlistItem[]>("/watchlist");

export const getFollowingFeed = async () =>
  httpClient.get<IActivityItem[]>("/activity/feed");

export const getWatchedHistory = async () =>
  httpClient.get<IDiaryEntry[]>("/watchedHistory");
