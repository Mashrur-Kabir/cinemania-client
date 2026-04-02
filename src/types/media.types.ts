import { ApiResponse } from "./api.types";

export interface IGenre {
  id: string;
  name: string;
}

export interface IMedia {
  id: string;
  title: string;
  slug: string;
  description: string;
  releaseYear: number;
  director: string;
  cast: string[];
  platform: string;
  pricing: "FREE" | "BASIC" | "PRO" | "PREMIUM";
  streamingUrl: string;
  isDeleted: boolean;
  deletedAt: string;
  averageRating: number;
  viewCount: number;
  likeCount: number;
  reviewCount: number;
  watchCount: number;
  createdAt: string;
  genres: IGenre[];
}

export type MediaResponse = ApiResponse<IMedia[]>;
