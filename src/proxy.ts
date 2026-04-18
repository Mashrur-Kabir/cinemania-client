import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
} from "./lib/authUtils";
import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from "./services/auth.services";
import { jwtUtils } from "./lib/tokens/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokens/tokenUtils";
import { UserRole } from "@/types/user.types";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken);
    return !!refresh;
  } catch (error) {
    console.error("Error refreshing token in proxy:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const decodedToken = accessToken
      ? jwtUtils.verifyToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        ).data
      : null;

    const isValidSession = !!(accessToken && decodedToken);
    const userRole = decodedToken?.role as UserRole | null;
    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // 🔄 1. Proactive Token Refresh (Session Repair)
    if (
      isValidSession &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken!))
    ) {
      const requestHeaders = new Headers(request.headers);
      const refreshed = await refreshTokenMiddleware(refreshToken);

      if (refreshed) {
        requestHeaders.set("x-token-refreshed", "1");
        return NextResponse.next({
          request: { headers: requestHeaders },
        });
      }
    }

    // 🔐 2. Auth Page Logic (Login/Register)
    // Redirect logged-in users away from auth pages unless verifying email
    if (isAuth && isValidSession && pathname !== "/verify-email") {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole!), request.url),
      );
    }

    // 🌐 3. Public Route Access
    if (routeOwner === null) {
      return NextResponse.next();
    }

    // 🛑 4. Protected Route Access Check
    if (!isValidSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // 👤 5. Detailed Account State Enforcement
    const userInfo = await getUserInfo(); //

    if (userInfo) {
      // 📧 Email Verification Check
      if (!userInfo.emailVerified && pathname !== "/verify-email") {
        const verifyUrl = new URL("/verify-email", request.url);
        verifyUrl.searchParams.set("email", userInfo.email);
        return NextResponse.redirect(verifyUrl);
      }

      // 🔑 Forced Password Change Check
      if (userInfo.needPasswordChange && pathname !== "/reset-password") {
        const resetUrl = new URL("/reset-password", request.url);
        resetUrl.searchParams.set("email", userInfo.email);
        return NextResponse.redirect(resetUrl);
      }

      // 🎖️ 6. Subscription Weight Gatekeeper (CineMania Specific)
      // If user is accessing /watch but doesn't have the tier weight
      if (pathname.startsWith("/watch") && userInfo.subscription) {
        // Logic will eventually compare media weight vs user weight
        //
      }
    }

    // 🏛️ 7. Role-Based Access Control (RBAC)
    if (routeOwner === "ADMIN" || routeOwner === "USER") {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole!), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Critical Proxy Error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
