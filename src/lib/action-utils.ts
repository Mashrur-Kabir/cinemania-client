/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiErrorResponse } from "@/types/api.types";

/**
 * 🛠️ Standardizes error extraction across all Server Actions.
 */
export const handleActionError = (
  error: any,
  fallback: string,
): ApiErrorResponse => {
  if (process.env.NODE_ENV === "development") {
    console.error("Action Error:", error);
  }
  return {
    success: false,
    message: error.response?.data?.message || error.message || fallback,
  };
};
