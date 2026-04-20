/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IMedia, TMediaPreview } from "@/types/media.types";
import { ApiResponse } from "@/types/api.types";

export interface IGenre {
  id: string;
  name: string;
}

/**
 * 🌐 Fetches all media for grids, discovery, and Admin Tables.
 * Accepts either an object of params or a raw query string.
 */
export const getAllMedia = async (
  query?: string | Record<string, any>,
): Promise<ApiResponse<TMediaPreview[]>> => {
  if (typeof query === "string") {
    // Used by the Admin Table Server Component
    return httpClient.get<TMediaPreview[]>(`/media?${query}`);
  }
  // Used by standard client components
  return httpClient.get<TMediaPreview[]>("/media", { params: query });
};

/**
 * 🔍 Fetches full details for a single media item via slug.
 */
export const getSingleMedia = async (
  slug: string,
): Promise<ApiResponse<IMedia>> => {
  return httpClient.get<IMedia>(`/media/${slug}`);
};

/**
 * 🔒 Protected: Fetches the secure stream link for subscribers.
 * Even with backend middleware, we need this to trigger the GET request
 * when the user hits 'Play'.
 */
export interface IStreamResponse {
  id: string;
  title: string;
  streamingUrl: string | null;
  pricing: string;
}

export const getMediaStream = async (
  id: string,
): Promise<ApiResponse<IStreamResponse>> => {
  return httpClient.get<IStreamResponse>(`/media/${id}/play`);
};

/**
 * 🗑️ Protected Admin: Soft deletes a media entry from the multiverse.
 */
export const deleteMediaAction = async (id: string) => {
  return httpClient.delete(`/media/${id}`);
};

/**
 * 🏷️ Fetches all genres for the Admin Multi-Select Filter.
 * (If you have a genre.services.ts, you can move this there later)
 */
export const getAllGenres = async (): Promise<ApiResponse<IGenre[]>> => {
  return httpClient.get<IGenre[]>("/genre");
};
