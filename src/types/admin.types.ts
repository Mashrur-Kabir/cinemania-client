export interface IAdminProfileStats {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    status: string;
    createdAt: string;
  };
  systemAccess: {
    clearanceLevel: string;
    grantedAt: string;
    modulesActive: number;
  };
  actionQueue: {
    pendingModerations: number;
    activeUsers: number;
    reportedReviews: number;
  };
}

export interface IAdminStats {
  platform: {
    totalUsers: number;
    totalPremiumUsers: number;
    totalMedia: number;
    totalRevenue: number;
  };
  engagement: {
    totalReviews: number;
    pendingReviewsCount: number;
    activeSubscriptions: number;
  };
  topContent: {
    mostWatched: { title: string; views: number } | null;
    highestRated: { title: string; rating: number } | null;
  };
  revenueData: {
    date: string;
    amount: number;
  }[];
  growthRate: number;
}
