/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/dashboard/notifications/NotificationCenter.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  Inbox,
  Heart,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquarePlus,
  Reply,
  Megaphone,
  PlayCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { NotificationType } from "@/types/notification.types";
import { getMyNotifications } from "@/services/notification.services";
import {
  markAllAsReadAction,
  markAsReadAction,
} from "@/app/_actions/notification.action";
import { UserInfo } from "@/types/user.types";

const NOTIFICATION_ICONS: Record<
  NotificationType,
  { icon: any; color: string }
> = {
  FOLLOW: { icon: UserPlus, color: "text-blue-400" },
  LIKE_REVIEW: { icon: Heart, color: "text-rose-500" },
  REVIEW_APPROVED: { icon: CheckCircle2, color: "text-emerald-500" },
  REVIEW_REJECTED: { icon: XCircle, color: "text-rose-500" },
  REPORT_ALERT: { icon: AlertTriangle, color: "text-amber-500" },
  COMMENT_ADD: { icon: MessageSquarePlus, color: "text-indigo-400" },
  COMMENT_REPLY: { icon: Reply, color: "text-sky-400" },
  SYSTEM_ANNOUNCEMENT: { icon: Megaphone, color: "text-primary" },
  WATCHED_MEDIA: { icon: PlayCircle, color: "text-white" },
};

// 🎯 Animation Variants for the Container
const menuVariants: Variants = {
  hidden: { opacity: 0, y: -15, scale: 0.95, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      staggerChildren: 0.05, // 🎯 Cascades the children inward
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    filter: "blur(5px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// 🎯 Animation Variants for Individual Notifications
const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

export default function NotificationCenter({
  user,
}: {
  user: UserInfo | null;
}) {
  // 🎯 THE FIX: Make the dropdown strictly controlled by React state
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: response } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
    enabled: !!user,
  });

  const { notifications = [], unreadCount = 0 } = response?.data || {};

  const { mutate: markRead } = useMutation<any, Error, string>({
    mutationFn: (id: string) => markAsReadAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: markAllAsReadAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    // 🎯 Use controlled state
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative group overflow-visible rounded-full transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none hover:bg-primary/20 hover:shadow-[0_0_25px_rgba(225,29,72,0.5),0_0_50px_rgba(225,29,72,0.3)] will-change-transform"
          >
            <Bell
              className={cn(
                "size-5 transition-all duration-300",
                unreadCount > 0
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-white",
              )}
            />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-2 right-2 size-2.5 bg-primary rounded-full border-2 border-[#030406] shadow-[0_0_15px_rgba(225,29,72,0.8)]"
                />
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          // 🎯 THE FIX: forceMount lets Radix calculate position immediately,
          // while Framer Motion's AnimatePresence handles the actual visible transition perfectly.
          <DropdownMenuContent
            forceMount
            align="end"
            sideOffset={12}
            asChild
            className={cn(
              "w-[400px] bg-[#0c0d10]/95 backdrop-blur-3xl border-white/5 p-0 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-white/10",
              "outline-none transform-gpu", // Removed Tailwind animate-in classes
            )}
          >
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    NOTIFICATIONS
                  </h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">
                    {unreadCount} New Notifications
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCheck className="size-3" /> Clear All
                  </button>
                )}
              </div>

              <ScrollArea className="h-[450px] custom-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {notifications.map((n) => {
                      const config =
                        NOTIFICATION_ICONS[n.type] ||
                        NOTIFICATION_ICONS.SYSTEM_ANNOUNCEMENT;
                      const Icon = config.icon;

                      return (
                        // 🎯 ANIMATION: Wrap each item in a staggered motion div
                        <motion.div key={n.id} variants={itemVariants}>
                          <Link
                            href={n.link || "#"}
                            onClick={() => {
                              if (!n.isRead) markRead(n.id);
                              setIsOpen(false); // Close dropdown on click
                            }}
                            className={cn(
                              "flex items-start gap-4 p-5 transition-all hover:bg-white/[0.03] relative group outline-none",
                              !n.isRead && "bg-primary/[0.02]",
                            )}
                          >
                            <div
                              className={cn(
                                "mt-1 flex-shrink-0 size-8 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-all group-hover:scale-110",
                                config.color,
                              )}
                            >
                              <Icon className="size-4" />
                            </div>

                            <div className="flex-1 space-y-1">
                              <p className="text-[11px] text-white/80 leading-relaxed font-medium group-hover:text-white transition-colors">
                                {n.displayMessage}
                              </p>
                              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                                {formatDistanceToNow(new Date(n.createdAt))} ago
                              </p>
                            </div>

                            {!n.isRead && (
                              <div className="size-1.5 bg-primary rounded-full mt-2 shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-[350px] flex flex-col items-center justify-center opacity-20"
                  >
                    <Inbox className="size-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                      No Active Signals
                    </p>
                  </motion.div>
                )}
              </ScrollArea>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}
