/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export const createCommentAction = async (payload: {
  content: string;
  reviewId: string;
  parentId?: string;
}) => {
  try {
    const res = await httpClient.post("/comment", payload);
    revalidatePath(`/dashboard/my-reviews/${payload.reviewId}`);
    return res.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Signal lost." };
  }
};

export const deleteCommentAction = async (id: string, reviewId: string) => {
  try {
    const res = await httpClient.delete(`/comment/${id}`);
    revalidatePath(`/dashboard/my-reviews/${reviewId}`);

    // 🎯 THE FIX: Return 'res' directly.
    // If your httpClient already returns response.data,
    // then 'res' is the object { success: true, message: "...", data: null }.
    // Returning 'res.data' was returning only the 'null'.
    return res;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Deletion failed." }
    );
  }
};
