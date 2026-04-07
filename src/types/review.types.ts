import { ApiResponse } from "./api.types";

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
  user?: { name: string; image: string }; // Optional for display
  media?: { title: string; posterUrl: string };
}

export type ReviewResponse = ApiResponse<IReview[]>;
