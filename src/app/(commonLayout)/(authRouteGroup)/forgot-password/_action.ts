/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  forgotPasswordZodSchema,
  IForgotPasswordPayload,
} from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (
  payload: IForgotPasswordPayload,
): Promise<ApiResponse<null> | ApiErrorResponse> => {
  const parsed = forgotPasswordZodSchema.safeParse(payload);
  if (!parsed.success)
    return { success: false, message: "Invalid email address" };

  try {
    await httpClient.post("/auth/forget-password", parsed.data);
    redirect(`/reset-password?email=${parsed.data.email}`);
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send reset code.",
    };
  }
};
