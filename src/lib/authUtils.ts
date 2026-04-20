import { UserRole } from "@/types/user.types";

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route) => route === pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

/**
 * Routes accessible by any logged-in user regardless of role
 */
export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/change-password", "/discovery", "/community"],
  pattern: [
    /^\/discovery/, // 🎯 Protects discovery and all sub-paths
    /^\/community/, // 🎯 Protects community and all sub-paths
    /^\/media/, // 🛡️ Recommended: Protect media detail pages too
    /^\/reviews/, // 🛡️ Recommended: Protect review detail pages too
  ],
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};

export const userProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/],
  exact: ["/watch"],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) return true;
  return routes.pattern.some((pattern) => pattern.test(pathname));
};

/**
 * Robust logic to determine which role "owns" or is required for a path.
 * Returns null for public routes.
 */
export const getRouteOwner = (
  pathname: string,
): "ADMIN" | "USER" | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }

  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }

  return null; // Public route
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  return role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
};

/**
 * Validates if a redirect path is safe/appropriate for a specific role.
 */
export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
) => {
  const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
  const routeOwner = getRouteOwner(sanitizedRedirectPath);

  // If public or common, anyone can be redirected there
  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  // Otherwise, the role must match the path owner
  return routeOwner === role;
};
