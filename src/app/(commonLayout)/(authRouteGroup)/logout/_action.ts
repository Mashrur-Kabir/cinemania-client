"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export const logoutAction = async () => {
  try {
    // 🎯 Hit backend first (Isomorphic httpClient handles cookies)
    await httpClient.post("/auth/logout", {});
  } catch (error) {
    console.error("Logout signaling failed, proceeding with local cleanup");
  } finally {
    const cookieStore = await cookies();
    // 🎯 Nuclear cleanup of local cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");
  }

  return { success: true };
};
