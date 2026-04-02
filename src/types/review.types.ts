import { ApiResponse } from "./api.types";

export interface IReview {
  id: string;
  rating: number;
  content: string;
  isSpoiler: boolean;
  tags: string[];
  likeCount: number;
  commentCount: number;
  mediaId: string;
  userId: string;
  createdAt: string;
  user?: { name: string; image: string }; // Optional for display
  media?: { title: string };
}

export type ReviewResponse = ApiResponse<IReview[]>;
