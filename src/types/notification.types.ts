// src/types/notification.types.ts

export type NotificationType =
  | "FOLLOW"
  | "LIKE_REVIEW"
  | "REVIEW_APPROVED"
  | "REVIEW_REJECTED"
  | "REPORT_ALERT"
  | "COMMENT_ADD"
  | "COMMENT_REPLY"
  | "SYSTEM_ANNOUNCEMENT"
  | "WATCHED_MEDIA";

export interface INotification {
  id: string;
  type: NotificationType;
  message: string;
  displayMessage: string; // 🎯 This is the generated sentence from your backend helper
  link?: string;
  isRead: boolean;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface INotificationResponse {
  notifications: INotification[];
  unreadCount: number;
}
