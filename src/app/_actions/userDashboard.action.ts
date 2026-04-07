"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";

export const toggleWatchlistAction = async (mediaId: string) => {
  const res = await httpClient.post(`/watchlist/${mediaId}`, {});

  // 🎯 The Cleaner Way: Only refresh the pages that use this data
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/watchlist");

  return res;
};
