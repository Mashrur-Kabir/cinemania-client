"use client";

import { logoutAction } from "@/app/(commonLayout)/(authRouteGroup)/logout/_action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user.types";
import { ShieldCheck, LogOut, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  userInfo: UserInfo;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Disconnecting from neural link...", {
      icon: <LogOut className="size-4 animate-pulse" />,
    });

    const res = await logoutAction();

    if (res.success) {
      toast.success("Session terminated", { id: toastId });
      router.push("/");
      router.refresh();
    } else {
      toast.error("Extraction failed", { id: toastId });
    }
  };

  // 🎯 Extracting common styles for Menu Items to keep the JSX clean
  const menuItemClasses = cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group outline-none",
    "text-muted-foreground hover:text-white hover:bg-white/5 focus:bg-white/5",
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 p-1 pr-3 rounded-full outline-none transition-all duration-300 group",
            "bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-primary/30",
          )}
        >
          <div
            className={cn(
              "relative size-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs transition-all",
              "shadow-[0_0_10px_rgba(225,29,72,0.3)] group-hover:shadow-[0_0_15px_rgba(225,29,72,0.6)]",
            )}
          >
            {userInfo.name.charAt(0).toUpperCase()}
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 border-2 border-[#030406] rounded-full" />
          </div>
          <ChevronDown className="size-3 text-muted-foreground group-hover:text-white transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          "w-64 mt-2 p-2 rounded-[1.5rem] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          "bg-[#030406]/80 backdrop-blur-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-black text-white truncate">
              {userInfo.name}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
              {userInfo.email}
            </span>
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit",
                "bg-primary/10 border border-primary/20",
              )}
            >
              <div className="size-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase">
                {userInfo.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/5 mx-2" />

        <div className="p-1 space-y-1">
          <DropdownMenuItem asChild>
            <Link href="/dashboard/my-profile" className={menuItemClasses}>
              <User className="size-4 group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold">Identity Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/security" className={menuItemClasses}>
              <ShieldCheck className="size-4 group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold">Security Access</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-white/5 mx-2" />

        <DropdownMenuItem
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 m-1 rounded-xl cursor-pointer transition-all group outline-none",
            "text-red-500/70 hover:text-red-500 hover:bg-red-500/10 focus:bg-red-500/10",
          )}
        >
          <LogOut className="size-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
