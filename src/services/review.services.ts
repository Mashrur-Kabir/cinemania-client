// src/services/review.services.ts
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview, IReviewDetail } from "@/types/review.types";
import { IQueryOptions } from "./user.services"; // Reuse the interface we defined earlier
import { ApiResponse } from "@/types/api.types";

/**
 * ✍️ GET MY REVIEWS
 * Fetches reviews with pagination and ownership filtering.
 */
export const getMyReviews = async (userId: string, params?: IQueryOptions) => {
  return httpClient.get<IReview[]>("/review", {
    params: { userId, ...params },
  });
};

/**
 * 🔍 GET SINGLE REVIEW
 * Fetches a single critique along with its associated media context
 * and a pre-structured recursive tree of comments for high-performance rendering.
 */
export const getSingleReview = async (
  id: string,
): Promise<ApiResponse<IReviewDetail>> => {
  return httpClient.get(`/review/${id}`);
};

/**
 * 🎞️ GET PUBLIC USER REVIEWS
 * Fetches only approved reviews for a specific user.
 */
export const getUserApprovedReviews = async (
  userId: string,
  params?: IQueryOptions,
) => {
  return httpClient.get<IReview[]>(`/review/user/${userId}`, { params });
};

/**
 * 🌍 GET PUBLIC COMMUNITY FEED
 * Fetches all approved reviews globally, sorted by recency.
 */
export const getPublicCommunityFeed = async (params?: IQueryOptions) => {
  return httpClient.publicGet<IReview[]>("/review/public", {
    params: {
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: 12,
      ...params,
    },
  });
};
