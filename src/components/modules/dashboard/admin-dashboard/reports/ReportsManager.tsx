"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldHalf, ArchiveX, Flag } from "lucide-react"; // 🎯 Added Flag
import { cn } from "@/lib/utils";
import ReportsTable from "./ReportsTable";
import ArchiveTable from "./ArchivedTable";
import ReportedQueueView from "./ReportedQueueView";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { getReportedReviews } from "@/services/admin.services";

const TABS = [
  {
    id: "pending",
    label: "Pending Moderation",
    icon: ShieldHalf,
    activeColor: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "reported", // 🎯 THE NEW TAB
    label: "User Reports",
    icon: Flag,
    activeColor: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    id: "archive",
    label: "Global Archive",
    icon: ArchiveX,
    activeColor: "text-zinc-400", // 🎯 Changed to zinc to contrast with the red reports tab
    bg: "bg-zinc-500/10",
  },
];

export default function ReportsManager({
  initialQueryString,
}: {
  initialQueryString: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = searchParams.get("tab") || "pending";

  const queryClient = useQueryClient();

  // 🎯 1. Initialize the transition hook
  const [isPendingTransition, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(initialQueryString);
    params.set("limit", "3");

    queryClient.prefetchQuery({
      queryKey: ["reported-reviews", params.toString()],
      queryFn: () => getReportedReviews(Object.fromEntries(params)),
    });
  }, []);

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    params.set("page", "1");

    // 🎯 2. Wrap router.push in startTransition to unblock the UI thread!
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-8">
      {/* 🎛️ Animated Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              // 🎯 Disable buttons while transitioning to prevent spam-clicking
              disabled={isPendingTransition}
              className={cn(
                "relative flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors z-10 disabled:opacity-70",
                isActive
                  ? tab.activeColor
                  : "text-white/40 hover:text-white/70",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabReports"
                  className={cn("absolute inset-0 rounded-xl z-[-1]", tab.bg)}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn("size-4", isActive && "animate-pulse")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 📊 Active Table View */}
      {/* 🎯 3. Wrap in AnimatePresence with a crossfade effect */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {currentTab === "pending" && (
              <ReportsTable initialQueryString={initialQueryString} />
            )}
            {currentTab === "reported" && (
              <ReportedQueueView initialQueryString={initialQueryString} />
            )}
            {currentTab === "archive" && (
              <ArchiveTable initialQueryString={initialQueryString} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
