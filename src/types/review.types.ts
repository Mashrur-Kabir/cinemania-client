import { ApiResponse } from "./api.types";
import { UserRole } from "./user.types";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IReview {
  id: string;
  rating: number;
  content: string;
  isSpoiler: boolean;
  tags: string[];
  status: ReviewStatus;
  likeCount: number;
  commentCount: number;
  mediaId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  user?: { name: string; image: string; role: UserRole }; // Optional for display
  media?: { title: string; posterUrl: string; slug: string };
}

export interface IComment {
  id: string;
  content: string;
  userId: string;
  reviewId: string;
  parentId: string | null;
  isEdited: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  replies: IComment[]; // 🎯 Recursive structure
}

export interface IReviewDetail extends IReview {
  comments: IComment[];
}

export type ReviewResponse = ApiResponse<IReview[]>;
