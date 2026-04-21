/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGenreAction, IGenre } from "@/services/genre.services";
import {
  genreValidationSchema,
  TGenreFormValues,
} from "@/zod/genre.validation";
import { toast } from "sonner";
import { X, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditGenreModal({
  open,
  onOpenChange,
  genre,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre: IGenre | null;
}) {
  const queryClient = useQueryClient();

  const form = useForm<TGenreFormValues>({
    resolver: zodResolver(genreValidationSchema),
  });

  const {
    formState: { errors, isDirty },
    reset,
    handleSubmit,
  } = form;

  useEffect(() => {
    if (genre && open) {
      reset({ name: genre.name });
    }
  }, [genre, open, reset]);

  const { mutate: updateGenre, isPending } = useMutation({
    mutationFn: (data: TGenreFormValues) => updateGenreAction(genre!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success("Taxonomy tag modified successfully.");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to modify genre.");
    },
  });

  return (
    <AnimatePresence>
      {open && genre && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
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
            className="relative w-full max-w-md bg-black/95 glass-panel border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/5 bg-purple-500/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <PencilLine className="size-4" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tighter">
                    Modify Tag
                  </h2>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit((data) => updateGenre(data))}
              className="p-6 space-y-6"
            >
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  Taxonomy Name
                </Label>
                <Input
                  {...form.register("name")}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500/50 h-12"
                />
                {errors.name && (
                  <p className="text-[10px] font-bold text-rose-500 uppercase">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending || !isDirty}
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
              >
                {isPending ? "Syncing..." : "Commit Update"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
