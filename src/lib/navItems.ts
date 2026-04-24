// src/lib/navItems.ts
import { UserRole } from "@/types/user.types";
import { getDefaultDashboardRoute } from "./authUtils";

export interface NavItem {
  title: string;
  href: string;
  icon?: string; // Optional for Top Nav, recommended for Sidebar
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

/**
 * 🌐 TOP NAVBAR LOGIC (Public/Common Layout)
 * Used in CommonNavbar. Returns a simple list of links.
 */
export const getCommonNavItems = (role?: UserRole): NavItem[] => {
  const items: NavItem[] = [
    { title: "Home", href: "/" },
    { title: "Discovery", href: "/discovery" },
    { title: "Community", href: "/community" },
  ];

  if (role) {
    // 1. Everyone gets a link to their respective dashboard
    items.push({
      title: "Dashboard",
      href: getDefaultDashboardRoute(role),
    });

    // 🎯 THE FIX: Only standard users get the Watchlist quick-link
    if (role === "USER") {
      items.push({
        title: "My Watchlist",
        href: "/dashboard/watchlist",
      });
    }
  }

  return items;
};

/**
 * 🛠️ DASHBOARD SIDEBAR LOGIC (Private/Dashboard Layout)
 * Used in Sidebar. Returns structured sections with icons.
 */
export const getDashboardNavItems = (role: UserRole): NavSection[] => {
  // 🎯 THE FIX: Dynamically set the base path based on the user's role
  const basePath = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  const commonItems: NavSection = {
    title: "Account",
    items: [
      { title: "My Profile", href: `${basePath}/my-profile`, icon: "User" },
      { title: "Security", href: `${basePath}/security`, icon: "ShieldCheck" },
    ],
  };

  const userItems: NavSection[] = [
    {
      title: "Personal",
      items: [
        { title: "Feed", href: "/dashboard", icon: "LayoutDashboard" },
        { title: "Watchlist", href: "/dashboard/watchlist", icon: "Bookmark" },
        { title: "History", href: "/dashboard/history", icon: "History" },
      ],
    },
    {
      title: "Social",
      items: [
        { title: "My Reviews", href: "/dashboard/my-reviews", icon: "Star" },
        { title: "Followers", href: "/dashboard/followers", icon: "Users" },
      ],
    },
    commonItems, // Appends Account section to bottom
  ];

  const adminItems: NavSection[] = [
    {
      title: "Management",
      items: [
        { title: "Overview", href: "/admin/dashboard", icon: "BarChart3" },
        {
          title: "Media Library",
          href: "/admin/dashboard/media",
          icon: "Clapperboard",
        },
        { title: "Genres", href: "/admin/dashboard/genres", icon: "Tags" },
      ],
    },
    {
      title: "System",
      items: [
        { title: "User Base", href: "/admin/dashboard/users", icon: "Users2" },
        {
          title: "Reports",
          href: "/admin/dashboard/reports",
          icon: "AlertOctagon",
        },
      ],
    },
    commonItems, // Appends Account section to bottom
  ];

  return role === "ADMIN" ? adminItems : userItems;
};
