// src/app/(dashboard)/dashboard/security/_actions/security.action.ts
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokens/tokenUtils";
import { ApiResponse, ApiErrorResponse } from "@/types/api.types";
import { IChangePasswordResponse } from "@/types/auth.types";
import { IChangePasswordPayload } from "@/zod/security.validation";

export const changePasswordAction = async (
  payload: IChangePasswordPayload,
): Promise<ApiResponse<IChangePasswordResponse> | ApiErrorResponse> => {
  try {
    const res = await httpClient.post<IChangePasswordResponse>(
      "/auth/change-password",
      payload,
    );

    if (res.success) {
      const { accessToken, refreshToken, token } = res.data;

      // 🎯 Update cookies so the session stays alive
      await setTokenInCookies("accessToken", accessToken);
      await setTokenInCookies("refreshToken", refreshToken);
      await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
    }

    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update password",
    };
  }
};
