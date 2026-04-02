export type UserRole = "ADMIN" | "USER";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
