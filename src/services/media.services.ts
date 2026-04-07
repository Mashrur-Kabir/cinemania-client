/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IMedia, TMediaPreview } from "@/types/media.types";
import { ApiResponse } from "@/types/api.types";

/**
 * 🌐 Fetches all media for grids and discovery.
 * Uses TMediaPreview because the 'Get All' view usually doesn't need
 * full descriptions/cast lists until the user clicks into a detail page.
 */
export const getAllMedia = async (
  params: Record<string, any> = {},
): Promise<ApiResponse<TMediaPreview[]>> => {
  return httpClient.get<TMediaPreview[]>("/media", { params });
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
