// src/app/_actions/notification.action.ts
"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { handleActionError } from "@/lib/action-utils";

export const markAsReadAction = async (id: string) => {
  try {
    return await httpClient.patch(`/notification/${id}/read`, {});
  } catch (error) {
    return handleActionError(error, "Failed to update notification status");
  }
};

export const markAllAsReadAction = async () => {
  try {
    return await httpClient.patch("/notification/mark-all-read", {});
  } catch (error) {
    return handleActionError(error, "Failed to clear notifications");
  }
};
