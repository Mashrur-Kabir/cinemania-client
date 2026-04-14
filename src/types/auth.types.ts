import { UserInfo, UserRole } from "./user.types";

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

export interface IRegisterResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "USER";
    emailVerified: boolean;
  };
}
export interface IChangePasswordResponse {
  token: string;
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
}
