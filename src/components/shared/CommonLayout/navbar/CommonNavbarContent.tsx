"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; // 1. Import Image
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "@/lib/navItems";
import { UserInfo } from "@/types/user.types";
import UserDropdown from "./UserDropdown";

// 2. Import your logo asset
import CinemaniaLogo from "@/assets/logo/cinemania_logo.png";

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
        "fixed top-0 w-full z-50 transition-all duration-500 border-b",
        isScrolled
          ? "bg-[#030406]/80 backdrop-blur-xl border-white/5 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* 🎬 Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={cn(
              "relative transition-all duration-500 flex items-center justify-center",
              isScrolled ? "size-12" : "size-14", // Shrinks slightly on scroll
            )}
          >
            {/* 🎯 Logo Image */}
            <Image
              src={CinemaniaLogo}
              alt="Cinemania Logo"
              width={100}
              height={100}
              className="object-contain drop-shadow-[0_0_8px_rgba(225,29,72,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(225,29,72,0.6)] transition-all"
              priority
            />
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
                  "text-sm font-bold transition-all relative py-1",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                {item.title}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {userInfo ? (
            <UserDropdown userInfo={userInfo} />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-muted-foreground hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Button
                asChild
                className="rounded-full px-6 font-bold shadow-[0_0_20px_rgba(225,29,72,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all"
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
