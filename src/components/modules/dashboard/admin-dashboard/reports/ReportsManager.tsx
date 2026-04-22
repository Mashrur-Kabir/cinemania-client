"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldHalf, ArchiveX } from "lucide-react";
import { cn } from "@/lib/utils";
import ReportsTable from "./ReportsTable";
import ArchiveTable from "./ArchivedTable";

const TABS = [
  {
    id: "pending",
    label: "Pending Moderation",
    icon: ShieldHalf,
    activeColor: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "archive",
    label: "Global Archive",
    icon: ArchiveX,
    activeColor: "text-rose-500",
    bg: "bg-rose-500/10",
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

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    params.set("page", "1"); // Reset page when switching tabs
    router.push(`${pathname}?${params.toString()}`);
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
              className={cn(
                "relative flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors z-10",
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
      <div>
        {currentTab === "pending" ? (
          <ReportsTable initialQueryString={initialQueryString} />
        ) : (
          <ArchiveTable initialQueryString={initialQueryString} />
        )}
      </div>
    </div>
  );
}
