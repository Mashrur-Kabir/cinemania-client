import { UserRole } from "./user.types";

export interface IFollowUser {
  id: string;
  name: string;
  image: string | null;
  role: UserRole;
}

export interface IFollowData {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: IFollowUser;
  following?: IFollowUser;
}
