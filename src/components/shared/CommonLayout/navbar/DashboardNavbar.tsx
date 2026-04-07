import { getUserInfo } from "@/services/auth.services";
import { getDashboardNavItems } from "@/lib/navItems";
import DashboardNavbarContent from "./DashboardNavbarContent";

export default async function DashboardNavbar() {
  const userInfo = await getUserInfo();

  if (!userInfo) return null;

  const navItems = getDashboardNavItems(userInfo.role);

  return <DashboardNavbarContent userInfo={userInfo} navItems={navItems} />;
}
