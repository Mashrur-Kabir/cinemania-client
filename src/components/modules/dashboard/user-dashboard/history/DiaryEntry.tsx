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
  AlertTriangle, // 🎯 Added for the warning icon
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
  const containerRef = useRef(null);
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
      // 🎨 Matching your Cinematic Dark Theme
      className:
        "bg-[#030406] border-white/10 text-white rounded-2xl shadow-2xl",
    });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full min-h-[300px] mb-24 md:mb-32"
    >
      {/* 📍 Central Timeline Node */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        <div className="size-4 rounded-full bg-primary shadow-[0_0_15px_rgba(225,29,72,0.8)] border-4 border-[#030406]" />
        <div className="h-full w-px bg-gradient-to-b from-primary/50 via-primary/10 to-transparent flex-1 min-h-[200px]" />
      </div>

      {/* 🎥 Content Card Grid */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-6 relative items-center",
          isEven ? "md:text-right" : "md:text-left",
        )}
      >
        {/* 🛠️ Dropdown: Unified with Edit and the new Sonner Delete */}
        <div
          className={cn(
            "absolute -top-6 z-30",
            isEven ? "md:left-10 left-6" : "md:right-10 right-6",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all outline-none">
              <MoreHorizontal className="size-5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isEven ? "start" : "end"}
              className="bg-[#030406]/95 backdrop-blur-xl border-white/10 text-white min-w-[180px] rounded-xl shadow-2xl"
            >
              <DropdownMenuItem
                onClick={() => setIsEditOpen(true)}
                className="gap-3 focus:bg-primary/10 focus:text-primary cursor-pointer py-3"
              >
                <Edit3 className="size-4" /> Edit Entry
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={triggerDeleteConfirmation}
                className="gap-3 focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer py-3"
              >
                <Trash2 className="size-4" /> Delete Forever
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 🖼️ Poster with Parallax Effect */}
        <div
          className={cn(
            "relative aspect-[2/3] w-full max-w-[240px] mx-auto overflow-hidden rounded-[2rem] shadow-2xl border border-white/5 group",
            isEven ? "md:ml-auto" : "md:mr-auto md:order-last",
          )}
        >
          <motion.div
            style={{ y }}
            className="absolute inset-0 h-[120%] -top-[10%]"
          >
            <Image
              src={
                entry.media.posterUrl ||
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000"
              }
              alt={entry.media.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        </div>

        {/* 📝 Details Section */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
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

          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">
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
              className="bg-white/5 border-white/10 text-white/50 px-3 py-1 rounded-lg font-bold"
            >
              {entry.media.releaseYear}
            </Badge>

            {entry.isRewatch && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1.5 px-3 py-1 rounded-lg font-bold">
                <Repeat className="size-3" /> REWATCH
              </Badge>
            )}
          </div>

          {entry.notes && (
            <div
              className={cn(
                "mt-6 p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 italic text-sm text-muted-foreground/80 leading-relaxed relative",
                isEven ? "text-right" : "text-left",
              )}
            >
              <MessageSquareQuote
                className={cn(
                  "size-8 absolute -top-4 opacity-10 text-primary",
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
