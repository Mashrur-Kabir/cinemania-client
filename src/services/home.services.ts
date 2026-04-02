"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IMedia } from "@/types/media.types";
import { IReview } from "@/types/review.types";
import { unstable_cache } from "next/cache";

/**
 * 🎞️ Trending Media: Sort by viewCount
 */
export const getTrendingMedia = unstable_cache(
  async () => {
    return await httpClient.get<IMedia[]>("/media", {
      params: { sortBy: "viewCount", sortOrder: "desc", limit: 6 },
    });
  },
  ["trending-media"],
  { revalidate: 3600, tags: ["media"] }, // Revalidate every hour
);

/**
 * ✍️ Popular Reviews: Sort by likeCount
 */
export const getPopularReviews = unstable_cache(
  async () => {
    return await httpClient.get<IReview[]>("/review", {
      params: { sortBy: "likeCount", sortOrder: "desc", limit: 4 },
    });
  },
  ["popular-reviews"],
  { revalidate: 600, tags: ["review"] }, // Revalidate every 10 mins
);

/**
 * 🌟 Top Rated: Sort by averageRating
 */
export const getTopRatedMedia = unstable_cache(
  async () => {
    return await httpClient.get<IMedia[]>("/media", {
      params: { sortBy: "averageRating", sortOrder: "desc", limit: 6 },
    });
  },
  ["top-rated-media"],
  { revalidate: 3600 },
);

/**
 * 🆕 New Arrivals: Sort by createdAt
 */
export const getNewArrivals = unstable_cache(
  async () => {
    return await httpClient.get<IMedia[]>("/media", {
      params: { sortBy: "createdAt", sortOrder: "desc", limit: 6 },
    });
  },
  ["new-arrivals"],
  { revalidate: 1800 },
);
