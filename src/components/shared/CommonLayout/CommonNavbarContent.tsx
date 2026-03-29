"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "@/lib/navItems";
import { Film } from "lucide-react";
import { UserInfo } from "@/types/user.types";
import UserDropdown from "./UserDropdown";

interface CommonNavbarContentProps {
  userInfo: UserInfo | null;
  navItems: NavItem[];
}

const CommonNavbarContent = ({
  userInfo,
  navItems,
}: CommonNavbarContentProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border py-3"
          : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
            <Film className="size-5 text-primary fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            CINE<span className="text-primary">MANIA</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all relative py-1",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                {item.title}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_8px_oklch(0.63_0.25_18)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {userInfo ? (
            <UserDropdown userInfo={userInfo} /> //
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Button
                asChild
                className="rounded-full px-6 shadow-[0_0_15px_rgba(225,29,72,0.2)]"
              >
                <Link href="/register">Join Community</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default CommonNavbarContent;
