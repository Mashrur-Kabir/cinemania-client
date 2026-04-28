/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "@/services/auth.services";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { UserRole } from "@/types/user.types";
import {
  verifyEmailZodSchema,
  IVerifyEmailPayload,
} from "@/zod/auth.validation";
import { redirect } from "next/navigation";

/**
 * Validates the OTP and redirects the user to their dashboard upon success.
 */
export const verifyEmailAction = async (
  payload: IVerifyEmailPayload,
): Promise<ApiResponse<null> | ApiErrorResponse> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid code format",
    };
  }

  try {
    //
    await httpClient.post("/auth/verify-email", parsedPayload.data);

    // After verification, fetch fresh user info to determine the correct dashboard
    const userInfo = await getUserInfo();
    const targetPath = userInfo
      ? getDefaultDashboardRoute(userInfo.role as UserRole)
      : "/login";

    redirect(targetPath);
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Verification failed. Please try again.",
    };
  }
};

/**
 * Resends the OTP to the user's email.
 */
export const resendOtpAction = async (
  email: string,
): Promise<ApiResponse<null> | ApiErrorResponse> => {
  try {
    //
    return await httpClient.post("/auth/resend-otp", { email });
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to resend code.",
    };
  }
};
