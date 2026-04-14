// src/services/notification.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import { INotificationResponse } from "@/types/notification.types";

export const getMyNotifications = () =>
  httpClient.get<INotificationResponse>("/notification");
