/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokens/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { loginZodSchema, ILoginPayload } from "@/zod/auth.validation";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ApiResponse<ILoginResponse> | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );
    const { accessToken, refreshToken, token, user } = response.data;

    // Persist tokens securely in HTTP-only cookies
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    if (user.needPasswordChange) {
      redirect(`/reset-password?email=${user.email}`);
    }

    if (!user.emailVerified) {
      redirect(`/verify-email?email=${user.email}`);
    }

    // Determine safe redirect path based on user role
    const targetPath =
      redirectPath &&
      isValidRedirectForRole(redirectPath, user.role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(user.role as UserRole);

    redirect(targetPath);
  } catch (error: any) {
    // Standard Next.js redirect handling
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Login failed. Please check your credentials.",
    };
  }
};
