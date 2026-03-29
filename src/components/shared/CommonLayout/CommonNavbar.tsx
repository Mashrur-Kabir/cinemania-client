import { getUserInfo } from "@/services/auth.services";
import { getCommonNavItems } from "@/lib/navItems";
import CommonNavbarContent from "./CommonNavbarContent";

const CommonNavbar = async () => {
  const userInfo = await getUserInfo(); //
  const navItems = getCommonNavItems(userInfo?.role);

  return <CommonNavbarContent userInfo={userInfo} navItems={navItems} />;
};

export default CommonNavbar;
