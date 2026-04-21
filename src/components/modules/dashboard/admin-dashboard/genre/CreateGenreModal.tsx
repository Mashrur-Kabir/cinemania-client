/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenreAction } from "@/services/genre.services";
import {
  genreValidationSchema,
  TGenreFormValues,
} from "@/zod/genre.validation";
import { toast } from "sonner";
import { Plus, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreateGenreModal() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TGenreFormValues>({
    resolver: zodResolver(genreValidationSchema),
    defaultValues: { name: "" },
  });

  const {
    formState: { errors },
    reset,
    handleSubmit,
  } = form;

  const { mutate: submitGenre, isPending } = useMutation({
    mutationFn: createGenreAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success("Taxonomy tag registered successfully.");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to register genre.",
      );
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => reset(), 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:shadow-[0_0_20px_rgba(192,38,211,0.4)] active:scale-95"
      >
        <Plus className="size-4" /> Add Tag
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-black/95 glass-panel border border-fuchsia-500/20 shadow-[0_0_50px_rgba(192,38,211,0.15)] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-fuchsia-500/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                    <Tag className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tighter">
                      Initialize Tag
                    </h2>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit((data) => submitGenre(data))}
                className="p-6 space-y-6"
              >
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Taxonomy Name
                  </Label>
                  <Input
                    {...form.register("name")}
                    placeholder="e.g. Cyberpunk"
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-fuchsia-500/50 h-12"
                    autoFocus
                  />
                  {errors.name && (
                    <p className="text-[10px] font-bold text-rose-500 uppercase">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(192,38,211,0.3)] transition-all"
                >
                  {isPending ? "Syncing..." : "Deploy Tag"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
