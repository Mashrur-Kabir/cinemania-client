/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { httpClient } from "@/lib/axios/httpClient";
import { handleActionError } from "@/lib/action-utils";

export const createReviewAction = async (payload: any) => {
  try {
    const res = await httpClient.post("/review", payload);
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/my-reviews");
    return res;
  } catch (error) {
    return handleActionError(error, "Failed to post review");
  }
};

export const updateReviewAction = async (id: string, payload: any) => {
  try {
    const res = await httpClient.patch(`/review/${id}`, payload);

    // ⚡ Surgical revalidation
    revalidatePath("/dashboard/my-reviews");

    return res;
  } catch (error) {
    return handleActionError(error, "Failed to update review");
  }
};

export const deleteReviewAction = async (id: string) => {
  try {
    const res = await httpClient.delete(`/review/${id}`);
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/my-reviews");
    return res;
  } catch (error) {
    return handleActionError(error, "Failed to delete review");
  }
};

export const toggleLikeAction = async (id: string) => {
  try {
    const res = await httpClient.post(`/review/${id}/like`, {});
    revalidatePath("/dashboard/my-reviews");
    return res;
  } catch (error) {
    return handleActionError(error, "Failed to toggle like");
  }
};

export const updateReviewStatusAction = async (
  id: string,
  status: "APPROVED" | "REJECTED",
  reason?: string,
) => {
  try {
    const res = await httpClient.patch(`/review/${id}/status`, {
      status,
      reason,
    });
    revalidatePath("/admin/dashboard");
    return res;
  } catch (error: any) {
    return handleActionError(error, "Failed to modify signal status");
  }
};
