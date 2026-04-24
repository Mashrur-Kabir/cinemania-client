/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  X,
  Calendar,
  MessageSquare,
  RotateCcw,
  Clapperboard,
} from "lucide-react";
import {
  IUpdateHistoryForm,
  updateHistorySchema,
} from "@/zod/history.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IDiaryEntry } from "@/types/dashboard.types";
import { z } from "zod";
import { updateHistoryAction } from "@/app/_actions/history.action";

interface EditHistoryModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  entry: IDiaryEntry;
}

export default function EditHistoryModal({
  isOpen,
  setIsOpen,
  entry,
}: EditHistoryModalProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: updateEntry, isPending } = useMutation({
    mutationFn: (payload: IUpdateHistoryForm) =>
      updateHistoryAction(entry.id, payload),
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success("Memory updated successfully");
        queryClient.invalidateQueries({ queryKey: ["watchedHistory"] });
        setIsOpen(false);
      } else {
        toast.error(res.message);
      }
    },
  });

  const form = useForm({
    defaultValues: {
      watchedAt: new Date(entry.watchedAt).toISOString().split("T")[0],
      notes: entry.notes || "",
      isRewatch: entry.isRewatch,
    } as IUpdateHistoryForm,
    onSubmit: async ({ value }) => {
      const result = updateHistorySchema.safeParse(value);
      if (!result.success) {
        if (process.env.NODE_ENV === "development") {
          console.error("Zod Error Details:", z.treeifyError(result.error));
        }
        return;
      }
      await updateEntry(result.data);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-[#030406]/95 border-white/5 backdrop-blur-3xl p-0 overflow-hidden rounded-[2.5rem] shadow-2xl focus:outline-none [&>button]:hidden">
        <DialogClose className="absolute right-8 top-8 z-50 rounded-full p-2 text-white/30 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
          <X className="size-5" />
        </DialogClose>

        <div className="animate-in zoom-in-95 duration-500">
          {/* 🎭 Cinematic Header Area */}
          {/* 🎭 Cinematic Header Area - Refined Horizontal Layout */}
          <DialogHeader className="relative h-44 w-full p-0 space-y-0 overflow-hidden">
            <Image
              src={entry.media.posterUrl || ""}
              alt=""
              fill
              className="object-cover opacity-10 blur-xl scale-125"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030406] via-[#030406]/20 to-transparent" />

            {/* 🎯 Grid/Flex Row for Poster Left, Title Right */}
            <div className="absolute inset-0 flex items-center gap-6 px-10 pt-6">
              <div className="relative h-28 aspect-[2/3] rounded-xl overflow-hidden border border-primary/50 shadow-[0_0_30px_rgba(225,29,72,0.3)] shrink-0 transition-transform hover:scale-105 duration-500">
                <Image
                  src={entry.media.posterUrl || ""}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start gap-1 pb-2">
                <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                  {entry.media.title}
                </DialogTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mt-1">
                  <Clapperboard className="size-3 text-primary" />
                  <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">
                    Editing Entry
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="p-10 pt-4 space-y-6"
          >
            {/* 🛠️ Symmetrical Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field name="watchedAt">
                {(field) => (
                  <AppField
                    field={field}
                    label="Watched Date"
                    type="date"
                    className="flex-1 text-white/70"
                    prepend={<Calendar className="size-4 text-primary/60" />}
                  />
                )}
              </form.Field>

              <form.Field name="isRewatch">
                {(field) => (
                  <div className="space-y-1.5 flex-1">
                    <label className="text-sm font-medium text-white/70">
                      Experience Type
                    </label>
                    <div
                      onClick={() => field.handleChange(!field.state.value)}
                      className={cn(
                        "flex items-center justify-between px-4 mt-1.5 h-8 rounded-md border transition-all duration-300",
                        field.state.value
                          ? "bg-primary/5 border-primary/40 text-primary"
                          : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-white/20",
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {field.state.value ? "Watched Again" : "First Watch"}
                      </span>
                      <RotateCcw
                        className={cn(
                          "size-3.5 transition-transform duration-500",
                          field.state.value && "rotate-180",
                        )}
                      />
                    </div>
                  </div>
                )}
              </form.Field>
            </div>

            {/* 📝 Notes Area */}
            <form.Field name="notes">
              {(field) => (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/70">
                    Diary Notes
                  </label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 size-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="What made this watch special?"
                      className="w-full min-h-[120px] bg-white/[0.03] border border-white/10 rounded-xl p-4 mt-1.5 pl-12 text-sm focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/20"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] text-destructive font-bold uppercase mt-1">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <AppSubmitButton
              isPending={isPending}
              pendingLabel="Saving Entry..."
              className="h-12 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10"
            >
              Update Diary Entry
            </AppSubmitButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
