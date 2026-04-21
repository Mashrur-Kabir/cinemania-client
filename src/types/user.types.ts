export type UserRole = "ADMIN" | "USER";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

export interface IUserProfileStats {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
    status: string;
    isFollowing: boolean;
  };
  overview: {
    totalWatched: number;
    totalMinutes: number;
    reviewCount: number;
    followers: number;
    following: number;
  };
  subscription: {
    plan: string;
    expiryDate: string | null;
    isActive: boolean;
  };
  genres: { name: string; count: number; percentage: number }[];
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
  }[];
  watchActivity: { month: string; count: number }[];
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: {
    type: string;
    value: number;
    genreName?: string;
    tier?: string;
  };
  isEarned: boolean;
  earnedAt: string | null;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  needPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface IUserAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    adminUsers: number;
  };
  statusDistribution: { name: string; value: number }[];
  roleDistribution: { name: string; value: number }[];
  growthData: { month: string; count: number }[];
}
