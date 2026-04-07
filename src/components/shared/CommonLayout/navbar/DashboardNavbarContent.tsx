"use client";

import { Search, Bell, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavSection } from "@/lib/navItems";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import MobileSidebar from "../sidebar/MobileSidebar";

interface DashboardNavbarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
}

export default function DashboardNavbarContent({
  userInfo,
  navItems,
}: DashboardNavbarContentProps) {
  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-30">
      {/* 📱 Left Side: Mobile Menu + Title */}
      <div className="flex items-center gap-4">
        <MobileSidebar navItems={navItems} userInfo={userInfo} />
        <h2 className="text-xl font-heading font-black text-white tracking-tighter uppercase">
          Command <span className="text-primary">Center</span>
        </h2>
      </div>

      {/* 🔍 Center: Universal Search */}
      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search movies, users, or reviews..."
            className="w-full bg-white/[0.03] border-white/10 pl-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all rounded-xl"
          />
        </div>
      </div>

      {/* 🔔 Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-white hover:bg-white/5"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#030406] shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
        </Button>

        <Separator
          orientation="vertical"
          className="h-6 bg-white/10 hidden md:block"
        />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full border border-white/10 p-0 hover:bg-white/5"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={userInfo.image} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {userInfo.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-[#0c0d10] border-white/10 text-white"
            align="end"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">
                  {userInfo.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userInfo.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-white/5 focus:text-primary"
            >
              <Link href="/my-profile" className="flex w-full items-center">
                <Settings className="mr-2 size-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500">
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
