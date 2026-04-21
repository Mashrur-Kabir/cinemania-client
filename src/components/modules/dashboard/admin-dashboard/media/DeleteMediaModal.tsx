/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMediaAction } from "@/services/media.services";
import { TMediaPreview } from "@/types/media.types";
import { toast } from "sonner";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DeleteMediaDialog({
  open,
  onOpenChange,
  media,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: TMediaPreview | null;
}) {
  const queryClient = useQueryClient();

  const { mutate: deleteMedia, isPending } = useMutation({
    mutationFn: () => deleteMediaAction(media!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media successfully purged from the Multiverse.");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to purge media.");
    },
  });

  return (
    <AnimatePresence>
      {open && media && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isPending && onOpenChange(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "relative w-full max-w-md bg-black/95 glass-panel overflow-hidden flex flex-col transition-colors duration-500",
              isPending
                ? "border-rose-500/60 shadow-[0_0_80px_rgba(225,29,72,0.3)]"
                : "border-rose-500/30 shadow-[0_0_50px_rgba(225,29,72,0.15)]",
            )}
          >
            {/* 🩸 Subtle Danger Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-rose-500/10 blur-[60px] pointer-events-none" />

            {/* Warning Header */}
            <div className="p-6 border-b border-white/5 bg-rose-500/[0.02] flex items-start gap-4 relative z-10">
              <div
                className={cn(
                  "p-3 rounded-full border shrink-0 transition-colors duration-300",
                  isPending
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-500",
                )}
              >
                <AlertTriangle
                  className={cn(
                    "size-6",
                    isPending ? "animate-spin" : "animate-pulse",
                  )}
                />
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-lg font-black text-white uppercase tracking-tighter">
                  Initiate Purge Sequence
                </h2>
                <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest mt-1">
                  Critical Action Required
                </p>
              </div>
              <button
                onClick={() => !isPending && onOpenChange(false)}
                disabled={isPending}
                className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors disabled:opacity-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="p-8 space-y-6 relative z-10">
              <p className="text-sm text-white/70 leading-relaxed text-center">
                You are about to sever the multiverse link for{" "}
                <span className="font-black text-white">❝{media.title}❞</span>.
                This will remove it from the public catalog. Are you sure you
                wish to proceed?
              </p>

              <div
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors duration-300",
                  isPending
                    ? "bg-rose-500/10 border-rose-500/30"
                    : "bg-white/[0.02] border-white/5",
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.8)] transition-colors duration-300",
                    isPending ? "bg-white animate-ping" : "bg-rose-500",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300",
                    isPending ? "text-rose-200" : "text-white/40",
                  )}
                >
                  Target ID: {media.id.split("-")[0]}...
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/5 bg-black/40 flex items-center gap-4 relative z-10">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-transparent transition-colors disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => deleteMedia()}
                disabled={isPending}
                className={cn(
                  "flex-1 font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2",
                  isPending
                    ? "bg-rose-900 text-white/50 border border-rose-800 shadow-none cursor-not-allowed"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)]",
                )}
              >
                {isPending ? (
                  "Purging..."
                ) : (
                  <>
                    <Trash2 className="size-3" /> Confirm Delete
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
