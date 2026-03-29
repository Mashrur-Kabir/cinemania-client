import { UserRole, getDefaultDashboardRoute } from "./authUtils"; //

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

/**
 * Returns the base navigation items for the CommonNavbar.
 * Dynamically injects the 'Dashboard' and 'Watchlist' routes if a role is present.
 */
export const getCommonNavItems = (role?: UserRole): NavItem[] => {
  const items: NavItem[] = [
    { title: "Home", href: "/" },
    { title: "Discovery", href: "/discovery" },
    { title: "Community", href: "/community" },
  ];

  if (role) {
    // Dynamically resolve the dashboard route based on the user's specific role (ADMIN vs USER)
    //
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
