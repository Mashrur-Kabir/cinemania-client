/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  resetPasswordZodSchema,
  IResetPasswordPayload,
} from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (
  payload: IResetPasswordPayload,
): Promise<ApiResponse<null> | ApiErrorResponse> => {
  const parsed = resetPasswordZodSchema.safeParse(payload);
  if (!parsed.success) return { success: false, message: "Invalid inputs" };

  // Strip confirmPassword before sending to the backend
  const { confirmPassword, ...resetData } = parsed.data;

  try {
    await httpClient.post("/auth/reset-password", resetData);
    redirect("/login?reset=success");
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return {
      success: false,
      message: error.response?.data?.message || "Password reset failed.",
    };
  }
};
