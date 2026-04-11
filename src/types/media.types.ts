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
  platform?: string;
  pricing: "FREE" | "BASIC" | "PRO" | "PREMIUM";
  posterUrl?: string;
  streamingUrl?: string;
  isDeleted: boolean;
  deletedAt: string;
  averageRating: number;
  viewCount: number;
  likeCount?: number;
  reviewCount: number;
  watchCount: number;
  createdAt: string;
  genres: IGenre[];
}

export type TMediaPreview = Pick<
  IMedia,
  | "id"
  | "title"
  | "slug"
  | "director"
  | "posterUrl"
  | "streamingUrl"
  | "releaseYear"
  | "averageRating"
  | "pricing"
  | "platform"
  | "likeCount"
  | "viewCount"
> & {
  // We explicitly make genres optional for previews to allow for 'Featured' fallbacks
  genres?: Pick<IGenre, "name">[];
};

export type MediaResponse = ApiResponse<IMedia[]>;
