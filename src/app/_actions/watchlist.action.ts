"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import { handleActionError } from "@/lib/action-utils";

/**
 * 📌 WATCHLIST
 * Toggles a media item in the user's personal watchlist.
 */
export const toggleWatchlistAction = async (mediaId: string) => {
  try {
    const res = await httpClient.post(`/watchlist/${mediaId}`, {});

    // ⚡ Purge the cache for the entire dashboard subtree.
    // This updates the 'Total Watchlist' count on the overview
    // and the list on the dedicated watchlist page.
    revalidatePath("/dashboard", "layout");

    return res;
  } catch (error) {
    return handleActionError(error, "Failed to update your watchlist");
  }
};
