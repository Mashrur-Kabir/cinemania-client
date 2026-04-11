/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import { handleActionError } from "@/lib/action-utils";

/**
 * 🎞️ LOG TO HISTORY
 */
export const logToHistoryAction = async (payload: any) => {
  try {
    const res = await httpClient.post("/watchedHistory", payload);

    // ⚡ Revalidate dashboard to update "Total Entries" and "Fresh This Month" stats
    revalidatePath("/dashboard", "layout");

    return res;
  } catch (error) {
    return handleActionError(error, "Failed to log movie to your diary");
  }
};

/**
 * ✍️ UPDATE HISTORY
 */
export const updateHistoryAction = async (id: string, payload: any) => {
  try {
    const res = await httpClient.patch(`/watchedHistory/${id}`, payload);

    // ⚡ Revalidate to reflect changes in the Timeline and Stats
    revalidatePath("/dashboard", "layout");

    return res;
  } catch (error) {
    return handleActionError(error, "Failed to update your diary entry");
  }
};

/**
 * 🗑️ DELETE FROM HISTORY
 */
export const deleteHistoryAction = async (id: string) => {
  try {
    const res = await httpClient.delete(`/watchedHistory/${id}`);

    // ⚡ Revalidate to remove the item from the Timeline and update count stats
    revalidatePath("/dashboard", "layout");

    return res;
  } catch (error) {
    return handleActionError(
      error,
      "Failed to erase this memory from your diary",
    );
  }
};
