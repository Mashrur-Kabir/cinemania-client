/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IDiscoveryData } from "@/types/discovery.types";

/**
 * 🌐 Fetches Discovery Feed or Search Results.
 * Uses the dynamic IDiscoveryData to handle both categorised carousels
 * and the unified search grid.
 */
export const getDiscoveryData = async (
  params: Record<string, any> = {},
): Promise<ApiResponse<IDiscoveryData>> => {
  try {
    // 🎯 Use the generic <IDiscoveryData> to ensure response.data is typed
    return await httpClient.get<IDiscoveryData>("/discovery", { params });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Discovery Signal Interrupted:",
        error?.response?.data || error.message,
      );
    }

    // 🛡️ Fallback to prevent UI crash, matching the ApiResponse structure
    return {
      success: false,
      message: "Failed to fetch discovery data",
      data: {
        trending: [],
        recommendations: [],
        continueWatching: [],
        socialWatchParty: [],
      } as IDiscoveryData,
    };
  }
};
