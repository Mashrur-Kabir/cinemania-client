// src/services/review.services.ts
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview } from "@/types/review.types";
import { IQueryOptions } from "./user.services"; // Reuse the interface we defined earlier

/**
 * ✍️ GET MY REVIEWS
 * Fetches reviews with pagination and ownership filtering.
 */
export const getMyReviews = async (userId: string, params?: IQueryOptions) => {
  return httpClient.get<IReview[]>("/review", {
    params: { userId, ...params },
  });
};
