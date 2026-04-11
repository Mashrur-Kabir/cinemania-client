import { TMediaPreview } from "./media.types";

export interface IWatchlistItem {
  id: string;
  mediaId: string;
  createdAt: string;
  updatedAt: string;
  media: TMediaPreview;
}

export interface IDiaryEntry {
  id: string;
  mediaId: string;
  watchedAt: string;
  notes?: string;
  isRewatch: boolean;
  isCompleted: boolean;
  media: TMediaPreview;
}

export interface IUserStats {
  totalMoviesWatched: number;
  watchedThisMonth: number;
  genreBreakdown: Record<string, number>;
}

export interface IActivityItem {
  id: string;
  action: "LIKE_REVIEW" | "WATCH_MOVIE" | "POST_REVIEW" | "FOLLOW_USER";
  summary: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  metadata: {
    mediaId?: string;
    authorName?: string;
  };
}
