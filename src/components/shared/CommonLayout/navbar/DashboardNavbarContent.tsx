"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, LogOut, ShieldCheck } from "lucide-react";
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
import NotificationCenter from "@/components/modules/dashboard/notifications/NotificationCenter";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(commonLayout)/(authRouteGroup)/logout/_action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardNavbarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
}

export default function DashboardNavbarContent({
  userInfo,
  navItems,
}: DashboardNavbarContentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // 🎯 1. Handle Logout Logic
  const handleLogout = async () => {
    const toastId = toast.loading("Disconnecting...");

    const res = await logoutAction();

    if (res.success) {
      // 🚀 THIS IS THE KEY FIX
      queryClient.clear(); // ❗ stops all active queries instantly

      router.replace("/");
      toast.success("Logged out", { id: toastId });
    } else {
      toast.error("Logout failed", { id: toastId });
    }
  };

  // 🎯 2. Handle Search Logic
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/discovery?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={cn(
        "h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30",
        "border-b border-white/5 bg-black/40 backdrop-blur-md",
      )}
    >
      {/* 📱 Left Side: Mobile Menu + Title */}
      <div className="flex items-center gap-4">
        <MobileSidebar navItems={navItems} userInfo={userInfo} />
        <h2 className="text-xl font-heading font-black text-white tracking-tighter uppercase hidden sm:block">
          Command <span className="text-primary">Center</span>
        </h2>
      </div>

      {/* 🔍 Center: Universal Search */}
      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search movies, users, or reviews..."
            className={cn(
              "w-full bg-white/[0.03] border-white/10 pl-10 transition-all rounded-xl",
              "focus-visible:ring-primary/50 focus-visible:border-primary/50",
            )}
          />
        </div>
      </div>

      {/* 🔔 Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <NotificationCenter user={userInfo} />

        <Separator
          orientation="vertical"
          className="h-6 bg-white/10 hidden md:block"
        />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full border border-white/10 p-0 hover:bg-white/5 overflow-hidden transition-all hover:border-primary/50"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={userInfo.image || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {userInfo.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 mt-2 p-2 bg-[#0c0d10]/90 backdrop-blur-2xl border-white/10 text-white rounded-[1.5rem] shadow-2xl"
            align="end"
          >
            <DropdownMenuLabel className="px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-black truncate">{userInfo.name}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                  {userInfo.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-white/5 mx-2" />

            <div className="p-1 space-y-1">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/my-profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-primary group transition-all"
                >
                  <Settings className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold">Account Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/security"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-primary group transition-all"
                >
                  <ShieldCheck className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold">Access & Security</span>
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-white/5 mx-2" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 m-1 rounded-xl cursor-pointer text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-500 transition-all group"
            >
              <LogOut className="size-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
