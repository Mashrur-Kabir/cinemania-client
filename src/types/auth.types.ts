import { UserRole } from "@/lib/authUtils";

export interface ILoginResponse {
  token: string; // better-auth session token
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
    needPasswordChange: boolean;
    emailVerified: boolean;
  };
}
