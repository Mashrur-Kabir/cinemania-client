"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserAction } from "@/services/admin.services";
import { IUser } from "@/types/user.types";
import { toast } from "sonner";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DeleteUserDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
}) {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: () => deleteUserAction(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User access permanently revoked.");
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to revoke user access."),
  });

  return (
    <AnimatePresence>
      {open && user && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-auto">
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
            className="relative w-full max-w-md bg-black/95 glass-panel border border-rose-500/30 shadow-[0_0_50px_rgba(225,29,72,0.15)] overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-rose-500/10 blur-[60px] pointer-events-none" />
            <div className="p-6 border-b border-white/5 bg-rose-500/[0.02] flex items-start gap-4 relative z-10">
              <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0">
                <AlertTriangle
                  className={cn(
                    "size-6",
                    isPending ? "animate-spin" : "animate-pulse",
                  )}
                />
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-lg font-black text-white uppercase tracking-tighter">
                  Revoke Access
                </h2>
                <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest mt-1">
                  Terminal Action
                </p>
              </div>
            </div>
            <div className="p-8 space-y-6 relative z-10">
              <p className="text-sm text-white/70 leading-relaxed text-center">
                You are about to soft-delete{" "}
                <span className="font-black text-white">{user.email}</span>.
                This will block their access immediately. Proceed?
              </p>
            </div>
            <div className="p-6 border-t border-white/5 bg-black/40 flex items-center gap-4 relative z-10">
              <Button
                variant="ghost"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white/60"
              >
                Abort
              </Button>
              <Button
                onClick={() => deleteUser()}
                disabled={isPending}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                {isPending ? (
                  "Purging..."
                ) : (
                  <>
                    <Trash2 className="size-3 mr-2" /> Confirm Revoke
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
