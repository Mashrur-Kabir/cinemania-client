import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { getDashboardNavItems } from "@/lib/navItems";

export default async function DashboardSidebar() {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login");
  }

  const navItems = getDashboardNavItems(userInfo.role);

  return <DashboardSidebarContent navItems={navItems} userInfo={userInfo} />;
}
