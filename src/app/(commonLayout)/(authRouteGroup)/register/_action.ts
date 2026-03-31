/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokens/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IRegisterResponse } from "@/types/auth.types";
import { registerZodSchema, IRegisterPayload } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (
  payload: IRegisterPayload,
): Promise<ApiResponse<IRegisterResponse> | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      parsedPayload.data,
    );
    const { accessToken, refreshToken, token, user } = response.data;

    // Persist tokens returned in the JSON body
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    // Redirect to verification as per your backend requirement
    redirect(`/verify-email?email=${user.email}`);
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Registration failed. Please try again.",
    };
  }
};
