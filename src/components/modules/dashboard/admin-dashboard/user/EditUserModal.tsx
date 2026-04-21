/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserRoleAction,
  updateUserStatusAction,
} from "@/services/admin.services";
import { IUser } from "@/types/user.types";
import { toast } from "sonner";
import { X, UserCog, Save, ShieldAlert, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EditUserModal({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
}) {
  const queryClient = useQueryClient();
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [status, setStatus] = useState<"ACTIVE" | "BLOCKED">("ACTIVE");

  useEffect(() => {
    if (user && open) {
      setRole(user.role as "USER" | "ADMIN");
      setStatus(user.status as "ACTIVE" | "BLOCKED");
    }
  }, [user, open]);

  const { mutate: updatePermissions, isPending } = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (role !== user.role) await updateUserRoleAction(user.id, { role });
      if (status !== user.status)
        await updateUserStatusAction(user.id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User access parameters updated.");
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to sync user parameters."),
  });

  const isDirty = user && (role !== user.role || status !== user.status);

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-black/95 glass-panel border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/5 bg-cyan-500/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <UserCog className="size-4" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tighter">
                    Modify User Parameters
                  </h2>
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <ShieldAlert className="size-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    System Clearance
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["USER", "ADMIN"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r as any)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300",
                        role === r
                          ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          : "bg-white/[0.02] border-white/10 text-white/40 hover:bg-white/5",
                      )}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        {r}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Activity className="size-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Account Status
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["ACTIVE", "BLOCKED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s as any)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300",
                        status === s
                          ? s === "ACTIVE"
                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.2)]"
                          : "bg-white/[0.02] border-white/10 text-white/40 hover:bg-white/5",
                      )}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/40">
              <Button
                type="button"
                onClick={() => updatePermissions()}
                disabled={isPending || !isDirty}
                className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              >
                {isPending ? (
                  "Syncing..."
                ) : (
                  <>
                    <Save className="size-4 mr-2" /> Commit Parameters
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
