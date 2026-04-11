"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import { handleActionError } from "@/lib/action-utils";

/**
 * 🤝 TOGGLE FOLLOW
 * Connects or disconnects the user from another entity in the multiverse.
 */
export const toggleFollowAction = async (targetUserId: string) => {
  try {
    const res = await httpClient.post(`/follow/${targetUserId}`, {});

    // ⚡ Surgical revalidation for the Community tab
    revalidatePath("/dashboard/community");

    // ⚡ Revalidate the Overview in case you have a "Following" count there
    revalidatePath("/dashboard", "layout");

    return res;
  } catch (error) {
    return handleActionError(
      error,
      "The connection request was intercepted or failed.",
    );
  }
};
