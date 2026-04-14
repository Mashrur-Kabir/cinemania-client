import { logoutAction } from "@/app/(commonLayout)/(authRouteGroup)/logout/_action";
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
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserDropdownProps {
  userInfo: UserInfo;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. 🚀 Instant Feedback: Show toast immediately
    const toastId = toast.loading("Terminating session...", {
      icon: <LogOut className="size-4 animate-pulse" />,
    });

    // 2. ⚡ Parallel Execution: Run the server cleanup
    const res = await logoutAction();

    if (res.success) {
      // 3. 🌀 Smooth Transition: Navigate and Refresh without reload
      toast.success("Logged out successfully", { id: toastId });

      router.push("/"); // Smooth SPA navigation
      router.refresh(); // Re-validates server components (hides dashboard links)
    } else {
      toast.error("Logout failed, please try again", { id: toastId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="rounded-full">
          <span className="text-sm font-semibold">
            {userInfo.name.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userInfo.name}</p>

            <p className="text-xs text-muted-foreground">{userInfo.email}</p>

            <p className="text-xs text-primary capitalize">
              {userInfo.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={"/my-profile"}>
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href={"/change-password"}>
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout} // 🎯 Call the handler
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
