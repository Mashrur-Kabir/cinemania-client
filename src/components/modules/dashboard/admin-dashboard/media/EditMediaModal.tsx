/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// 🎯 THE FIX: Imported getSingleMedia to fetch the full data
import { updateMedia, getSingleMedia, IGenre } from "@/services/media.services";
import {
  updateMediaValidationSchema,
  TUpdateMediaFormValues,
} from "@/zod/media.validation";
import { TMediaPreview } from "@/types/media.types";
import { toast } from "sonner";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Film,
  Users,
  Tag,
  Link as LinkIcon,
  Check,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, title: "Core", icon: Film },
  { id: 2, title: "Crew", icon: Users },
  { id: 3, title: "Taxonomy", icon: Tag },
  { id: 4, title: "Assets", icon: LinkIcon },
];

export default function EditMediaModal({
  open,
  onOpenChange,
  media,
  genres,
  isLoadingGenres,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: TMediaPreview | null;
  genres: IGenre[];
  isLoadingGenres: boolean;
}) {
  const [step, setStep] = useState(1);
  const [castInput, setCastInput] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<TUpdateMediaFormValues>({
    resolver: zodResolver(updateMediaValidationSchema) as any,
    mode: "onChange",
  });

  const {
    formState: { errors, dirtyFields },
    watch,
    setValue,
    trigger,
  } = form;

  // 🎯 THE FIX: Fetch full media details when the modal opens
  const { data: fullMediaResponse, isFetching: isFetchingDetails } = useQuery({
    queryKey: ["media-details", media?.slug],
    queryFn: () => getSingleMedia(media!.slug),
    enabled: !!media?.slug && open, // Only fetch if we have a slug and the modal is open
    staleTime: 0, // Ensure we get fresh data for editing
  });

  const fullMedia = fullMediaResponse?.data;

  // 🎯 Pre-fill form when the FULL media object is loaded
  useEffect(() => {
    if (fullMedia && open) {
      form.reset({
        title: fullMedia.title,
        description: fullMedia.description, // Now we have it!
        releaseYear: fullMedia.releaseYear,
        director: fullMedia.director,
        cast: fullMedia.cast, // Now we have it!
        platform: fullMedia.platform || "",
        pricing: fullMedia.pricing as any,
        posterUrl: fullMedia.posterUrl || "",
        streamingUrl: fullMedia.streamingUrl || "",
        // 🎯 THE FIX: Map to IDs, not Names, so the UI buttons highlight properly
        genreIds: fullMedia.genres?.map((g) => g.id) || [],
      });
      setStep(1);
    }
  }, [fullMedia, open, form]);

  const { mutate: submitUpdate, isPending } = useMutation({
    mutationFn: (payload: TUpdateMediaFormValues) =>
      updateMedia(media!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Multiverse coordinates updated successfully!");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update media.");
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["title", "description", "releaseYear"];
    if (step === 2) fieldsToValidate = ["director", "cast"];
    if (step === 3) fieldsToValidate = ["platform", "pricing", "genreIds"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const handleAddCast = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = castInput.trim();
      if (val) {
        const currentCast = watch("cast") || [];
        if (!currentCast.includes(val)) {
          setValue("cast", [...currentCast, val], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        setCastInput("");
      }
    }
  };

  const removeCast = (name: string) => {
    const currentCast = watch("cast") || [];
    setValue(
      "cast",
      currentCast.filter((c: string) => c !== name),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const toggleGenre = (id: string) => {
    const currentGenres = watch("genreIds") || [];
    if (currentGenres.includes(id)) {
      setValue(
        "genreIds",
        currentGenres.filter((g: string) => g !== id),
        { shouldValidate: true, shouldDirty: true },
      );
    } else {
      setValue("genreIds", [...currentGenres, id], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = (data: TUpdateMediaFormValues) => {
    if (!media) return;

    const changedData: Partial<TUpdateMediaFormValues> = {};
    Object.keys(dirtyFields).forEach((key) => {
      changedData[key as keyof TUpdateMediaFormValues] = data[
        key as keyof TUpdateMediaFormValues
      ] as any;
    });

    if (Object.keys(changedData).length === 0) {
      toast.info("No modifications detected.");
      onOpenChange(false);
      return;
    }

    submitUpdate(changedData);
  };

  return (
    <AnimatePresence>
      {open && media && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-black/90 glass-panel border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                    Modify Entry
                  </h2>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    {media.title}
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 z-0" />
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 z-0 transition-all duration-500"
                  style={{
                    width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />
                {steps.map((s) => (
                  <div
                    key={s.id}
                    className="relative z-10 flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        "size-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-black",
                        step >= s.id
                          ? "bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white"
                          : "bg-white/5 border-white/10 text-white/40",
                      )}
                    >
                      <s.icon className="size-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Body with Loading Overlay */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative min-h-[300px]">
              {/* 🎯 THE FIX: Neon Spinner while fetching full details */}
              <AnimatePresence>
                {isFetchingDetails && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl"
                  >
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] mb-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 animate-pulse">
                      Decrypting File...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={form.handleSubmit(onSubmit as any)}>
                <AnimatePresence mode="wait">
                  {/* STEP 1: CORE */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Title
                        </Label>
                        <Input
                          {...form.register("title")}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
                        />
                        {errors.title && (
                          <p className="text-[10px] font-bold text-rose-500 uppercase">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Release Year
                        </Label>
                        <Input
                          type="number"
                          {...form.register("releaseYear")}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
                        />
                        {errors.releaseYear && (
                          <p className="text-[10px] font-bold text-rose-500 uppercase">
                            {errors.releaseYear.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Description
                        </Label>
                        <Textarea
                          {...form.register("description")}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50 min-h-25 resize-none"
                        />
                        {errors.description && (
                          <p className="text-[10px] font-bold text-rose-500 uppercase">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: CREW */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Director
                        </Label>
                        <Input
                          {...form.register("director")}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Cast Members
                        </Label>
                        <Input
                          value={castInput}
                          onChange={(e) => setCastInput(e.target.value)}
                          onKeyDown={handleAddCast}
                          placeholder="Add and press Enter..."
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
                        />
                        <div className="flex flex-wrap gap-2 pt-2">
                          <AnimatePresence>
                            {watch("cast")?.map((actor: string) => (
                              <motion.div
                                key={actor}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 group"
                              >
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                  {actor}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeCast(actor)}
                                  className="text-white/40 hover:text-rose-400 transition-colors"
                                >
                                  <X className="size-3" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: TAXONOMY */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Platform / Studio
                        </Label>
                        <Input
                          {...form.register("platform")}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Access Pricing Tier
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {["FREE", "BASIC", "PRO", "PREMIUM"].map((tier) => {
                            const isSelected = watch("pricing") === tier;
                            return (
                              <button
                                key={tier}
                                type="button"
                                onClick={() =>
                                  setValue("pricing", tier as any, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  })
                                }
                                className={cn(
                                  "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300",
                                  isSelected
                                    ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                    : "bg-white/[0.02] border-white/10 text-white/40 hover:bg-white/5 hover:border-white/20",
                                )}
                              >
                                {isSelected && <Check className="size-4" />}
                                <span className="text-[11px] font-black uppercase tracking-widest">
                                  {tier}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Genres Map
                        </Label>
                        {isLoadingGenres ? (
                          <div className="h-20 flex items-center justify-center text-[10px] font-bold text-white/40 uppercase animate-pulse">
                            Loading Grid...
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                            {genres.map((genre) => {
                              const isSelected = watch("genreIds")?.includes(
                                genre.id,
                              );
                              return (
                                <button
                                  key={genre.id}
                                  type="button"
                                  onClick={() => toggleGenre(genre.id)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all",
                                    isSelected
                                      ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                      : "bg-white/[0.02] border-white/10 text-white/40 hover:bg-white/10",
                                  )}
                                >
                                  {genre.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: ASSETS */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Poster URL
                        </Label>
                        <Input
                          {...form.register("posterUrl")}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                          Secure Streaming URL
                        </Label>
                        <Input
                          {...form.register("streamingUrl")}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50"
                        />
                      </div>

                      <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                          <Save className="size-5" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
                            Commit Changes
                          </h4>
                          <p className="text-[10px] text-white/50 leading-relaxed mt-1">
                            Review your modifications. Only altered data points
                            will be transmitted to the Nexus to preserve
                            bandwidth.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                disabled={step === 1 || isPending || isFetchingDetails}
                onClick={() => setStep((p) => p - 1)}
                className="text-white/50 hover:text-white hover:bg-white/5"
              >
                <ChevronLeft className="size-4 mr-1" /> Back
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isFetchingDetails}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-50"
                >
                  Next Sector <ChevronRight className="size-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit as any)}
                  disabled={isPending || Object.keys(dirtyFields).length === 0}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] px-8 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  {isPending ? "Syncing..." : "Commit Update"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
