// src/types/discovery.types.ts
import { TMediaPreview } from "@/types/media.types";

export interface IDiscoveryData {
  trending?: TMediaPreview[];
  recommendations?: TMediaPreview[];
  continueWatching?: {
    id: string;
    lastPosition: number;
    duration: number;
    media: TMediaPreview;
  }[];
  socialWatchParty?: {
    id: string;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
    media: TMediaPreview;
  }[];
  // 🎯 Add this for the Search Grid mode
  searchResults?: {
    data: TMediaPreview[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  };
}
