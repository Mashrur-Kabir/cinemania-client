"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { NavSection } from "@/lib/navItems";
import { UserInfo } from "@/types/user.types";
import { useState } from "react";

interface MobileSidebarProps {
  navItems: NavSection[];
  userInfo: UserInfo;
}

export default function MobileSidebar({
  navItems,
  userInfo,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-[280px] bg-[#030406] border-r-white/5"
      >
        {/* We pass the navItems and userInfo but force isCollapsed to false for mobile */}
        <DashboardSidebarContent navItems={navItems} userInfo={userInfo} />
      </SheetContent>
    </Sheet>
  );
}
