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
    items.push({
      title: "Dashboard",
      href: getDefaultDashboardRoute(role),
    });

    items.push({
      title: "My Watchlist",
      href: "/watchlist",
    });
  }

  return items;
};

/**
 * 🛠️ DASHBOARD SIDEBAR LOGIC (Private/Dashboard Layout)
 * Used in Sidebar. Returns structured sections with icons.
 */
export const getDashboardNavItems = (role: UserRole): NavSection[] => {
  const commonItems: NavSection = {
    title: "Account",
    items: [
      { title: "My Profile", href: "/my-profile", icon: "User" },
      { title: "Security", href: "/change-password", icon: "ShieldCheck" },
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
        { title: "Followers", href: "/dashboard/community", icon: "Users" },
      ],
    },
    commonItems,
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
    commonItems,
  ];

  return role === "ADMIN" ? adminItems : userItems;
};
