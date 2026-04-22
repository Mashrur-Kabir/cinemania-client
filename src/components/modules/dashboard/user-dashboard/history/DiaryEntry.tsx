/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { IDiaryEntry } from "@/types/dashboard.types";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Repeat,
  MessageSquareQuote,
  MoreHorizontal,
  Edit3,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditHistoryModal from "./EditHistoryModal";
import { deleteHistoryAction } from "@/app/_actions/history.action";

export default function DiaryEntry({
  entry,
  index,
}: {
  entry: IDiaryEntry;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. 🗑️ Delete Mutation Logic
  const { mutate: performDelete } = useMutation({
    mutationFn: () => deleteHistoryAction(entry.id),
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success("Memory erased from your diary");
        queryClient.invalidateQueries({ queryKey: ["watchedHistory"] });
      } else {
        toast.error(res.message || "Failed to remove entry");
      }
    },
    onError: () => toast.error("Temporal error: Failed to reach the database"),
  });

  // 2. 🎯 The "Industry Grade" Confirmation Flow
  const triggerDeleteConfirmation = () => {
    toast.warning("Erase this memory?", {
      description: "This entry will be permanently removed from your timeline.",
      icon: <AlertTriangle className="size-5 text-rose-500" />,
      duration: 5000,
      action: {
        label: "Delete",
        onClick: () => performDelete(),
      },
      cancel: {
        label: "Keep it",
        onClick: () => toast.dismiss(),
      },
      className:
        "bg-[#030406] border-white/10 text-white rounded-2xl shadow-2xl",
    });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={containerRef}
      // 🎯 THE FIX: Inline style ensures Framer Motion calculates offset correctly before CSS loads
      style={{ position: "relative" }}
      className="relative flex items-center justify-center w-full min-h-[300px] mb-24 md:mb-32 group/entry"
    >
      {/* 📍 Central Timeline Node */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        <div className="size-4 rounded-full bg-primary/40 group-hover/entry:bg-primary transition-colors duration-700 shadow-[0_0_15px_rgba(225,29,72,0.8)] border-4 border-[#030406] relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-sm scale-150 group-hover/entry:scale-100 transition-transform duration-700" />
        </div>
        <div className="h-full w-px bg-gradient-to-b from-primary/50 via-primary/10 to-transparent flex-1 min-h-[200px]" />
      </div>

      {/* 🎥 Content Card Grid */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-6 relative items-center",
          isEven ? "md:text-right" : "md:text-left",
        )}
      >
        {/* 🛠️ Dropdown */}
        <div
          className={cn(
            "absolute -top-6 z-30",
            isEven ? "md:left-10 left-6" : "md:right-10 right-6",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all outline-none group/btn">
              <MoreHorizontal className="size-5 text-muted-foreground group-hover/btn:text-white transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isEven ? "start" : "end"}
              className="bg-[#030406]/95 backdrop-blur-xl border-white/10 text-white min-w-[180px] rounded-xl shadow-2xl"
            >
              <DropdownMenuItem
                onClick={() => setIsEditOpen(true)}
                className="gap-3 focus:bg-primary/10 focus:text-primary cursor-pointer py-3 transition-colors"
              >
                <Edit3 className="size-4" /> Edit Entry
              </DropdownMenuItem>
              {/* 🎯 THE FIX: Explicit Tailwind color overrides for Radix UI focus state */}
              <DropdownMenuItem
                onClick={triggerDeleteConfirmation}
                className="gap-3 text-rose-500 focus:bg-rose-500/10 focus:text-primary cursor-pointer py-3 transition-colors"
              >
                <Trash2 className="size-4" /> Delete Forever
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 🖼️ Poster with Fixed Parallax & Light Bleed Effect */}
        <div
          className={cn(
            "relative w-full max-w-[240px] mx-auto group/poster perspective-1000",
            isEven ? "md:ml-auto" : "md:mr-auto md:order-last",
          )}
        >
          {/* Subtle colored shadow matching the image (Light Bleed) */}
          <div className="absolute inset-4 bg-primary/20 blur-[40px] rounded-full opacity-0 group-hover/poster:opacity-100 transition-opacity duration-1000 -z-10" />

          {/* 🎯 THE FIX: Removed hover:-translate-y-2 and updated to transition-all for buttery smoothness */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 group-hover/poster:border-primary/30 transition-all duration-700 ease-out hover:shadow-[0_20px_40px_-10px_rgba(225,29,72,0.3)]">
            <motion.div
              style={{ y }}
              className="absolute inset-0 h-[120%] -top-[10%] w-full"
            >
              <Image
                src={
                  entry.media.posterUrl ||
                  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000"
                }
                alt={entry.media.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transform-gpu group-hover/poster:scale-105 transition-transform duration-1000 ease-out will-change-transform"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/poster:opacity-60 transition-opacity duration-700" />
          </div>
        </div>

        {/* 📝 Details Section */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -20 : 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col justify-center gap-4"
        >
          <div
            className={cn(
              "flex items-center gap-3 text-primary text-[10px] font-black tracking-[0.3em] uppercase",
              isEven ? "md:justify-end" : "md:justify-start",
            )}
          >
            <Calendar className="size-3.5" />
            {format(new Date(entry.watchedAt), "MMMM dd, yyyy")}
          </div>

          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] drop-shadow-md">
            {entry.media.title}
          </h3>

          <div
            className={cn(
              "flex flex-wrap gap-2.5 mt-2",
              isEven ? "md:justify-end" : "md:justify-start",
            )}
          >
            <Badge
              variant="outline"
              className="bg-white/5 border-white/10 text-white/50 px-3 py-1 rounded-lg font-bold backdrop-blur-sm"
            >
              {entry.media.releaseYear}
            </Badge>

            {entry.isRewatch && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1.5 px-3 py-1 rounded-lg font-bold backdrop-blur-sm">
                <Repeat className="size-3" /> REWATCH
              </Badge>
            )}
          </div>

          {entry.notes && (
            <div
              className={cn(
                "mt-6 p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 italic text-sm text-white/60 leading-relaxed relative hover:bg-white/[0.04] transition-colors duration-500",
                isEven ? "text-right" : "text-left",
              )}
            >
              <MessageSquareQuote
                className={cn(
                  "size-8 absolute -top-4 opacity-20 text-primary",
                  isEven ? "-right-2" : "-left-2",
                )}
              />
              {entry.notes}
            </div>
          )}
        </motion.div>
      </div>

      <EditHistoryModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        entry={entry}
      />
    </div>
  );
}
