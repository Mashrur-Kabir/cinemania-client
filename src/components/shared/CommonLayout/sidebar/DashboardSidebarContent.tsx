"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getIconComponent } from "@/lib/iconMapper";
import { UserInfo } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavSection } from "@/lib/navItems";
import { ChevronLeft, PanelLeftOpen } from "lucide-react"; // 🎯 Now both are used
import { Button } from "@/components/ui/button";

interface SidebarContentProps {
  navItems: NavSection[];
  userInfo: UserInfo;
}

export default function DashboardSidebarContent({
  navItems,
  userInfo,
}: SidebarContentProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col bg-[#030406]/60 backdrop-blur-xl border-r border-white/5 transition-all duration-500 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      {/* 🔄 Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-17 z-50 size-6 rounded-full border border-white/10 bg-[#030406] text-muted-foreground hover:text-primary shadow-xl transition-all hover:scale-110 active:scale-90"
      >
        {/* 🎯 FIX: Toggle icons based on state to clear the 'unused' error */}
        {isCollapsed ? (
          <PanelLeftOpen className="size-4 animate-in fade-in zoom-in duration-300 text-primary" />
        ) : (
          <ChevronLeft className="size-4 transition-transform duration-500" />
        )}
      </Button>

      {/* 🎬 Brand Logo Area */}
      <div className="flex h-20 items-center px-6 border-b border-white/5 overflow-hidden">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.5)] group-hover:scale-110 transition-transform shrink-0">
            <span className="text-white font-black text-xl italic">C</span>
          </div>
          <span
            className={cn(
              "font-heading font-black tracking-tighter text-xl text-white transition-all duration-500",
              isCollapsed ? "opacity-0 w-0" : "opacity-100",
            )}
          >
            CINE<span className="text-primary">MANIA</span>
          </span>
        </Link>
      </div>

      {/* 🧭 Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-6">
        <div className="space-y-8">
          {navItems.map((section, idx) => (
            <div key={idx} className="space-y-3">
              {section.title && !isCollapsed && (
                <h4 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-opacity duration-300">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  /* 🎯 FIX: Ensure we always pass a string to getIconComponent */
                  const iconName = item.icon || "HelpCircle";
                  const Icon = getIconComponent(iconName);
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        // 🎯 THE FIX: Added 'border border-transparent' and 'outline-none' to the base classes
                        "group flex items-center rounded-xl transition-all duration-300 border border-transparent outline-none",
                        isCollapsed
                          ? "justify-center gap-0 px-0 py-3"
                          : "gap-3 px-3 py-2.5",
                        isActive
                          ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(225,29,72,0.1)] border-primary/20" // 🎯 Removed 'border' here as it's now in the base
                          : "text-muted-foreground hover:bg-white/5 hover:text-white hover:border-white/10", // 🎯 Added a subtle border on hover for polish
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5 transition-transform group-hover:scale-110 shrink-0",
                          isActive && "text-primary",
                        )}
                      />

                      <span
                        className={cn(
                          "text-sm font-bold whitespace-nowrap transition-all duration-500",
                          isCollapsed
                            ? "opacity-0 w-0 overflow-hidden"
                            : "opacity-100",
                        )}
                      >
                        {item.title}
                      </span>

                      {!isCollapsed && isActive && (
                        <div className="ml-auto size-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(225,29,72,1)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
              {/* 🎯 FIX 3: Separator logic used correctly here */}
              {idx < navItems.length - 1 && (
                <Separator className="mt-6 mb-2 bg-white/5" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 👤 User Card (Adaptive) */}
      <div
        className={cn(
          "p-4 border-t border-white/5 bg-black/20 transition-all duration-500",
          isCollapsed ? "px-2" : "p-4",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500",
            isCollapsed ? "justify-center p-1" : "p-2",
          )}
        >
          <Avatar className="size-10 border border-primary/20 shrink-0">
            <AvatarImage src={userInfo?.image || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">
              {userInfo.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div
            className={cn(
              "flex-1 overflow-hidden transition-all duration-500",
              isCollapsed ? "opacity-0 w-0" : "opacity-100",
            )}
          >
            <p className="text-sm font-bold text-white truncate">
              {userInfo.name}
            </p>
            <p className="text-[10px] font-black text-primary uppercase tracking-tighter">
              {userInfo.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
