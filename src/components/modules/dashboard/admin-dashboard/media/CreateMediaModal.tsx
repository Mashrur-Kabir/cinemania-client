/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// @react-compiler-reset
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMedia, IGenre } from "@/services/media.services";
import {
  mediaValidationSchema,
  TMediaFormValues,
} from "@/zod/media.validation";
import { toast } from "sonner";
import {
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Film,
  Users,
  Tag,
  Link as LinkIcon,
  Check,
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

export default function CreateMediaModal({
  genres,
  isLoadingGenres,
}: {
  genres: IGenre[];
  isLoadingGenres: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [castInput, setCastInput] = useState("");

  const queryClient = useQueryClient();

  const form = useForm<TMediaFormValues>({
    resolver: zodResolver(mediaValidationSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      releaseYear: new Date().getFullYear(),
      director: "",
      cast: [],
      platform: "",
      pricing: "FREE",
      posterUrl: "",
      streamingUrl: "",
      genreIds: [],
    },
    mode: "onChange",
  });

  const {
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = form;

  // 🚀 Mutation to Create Media & Invalidate Table Cache
  const { mutate: submitMedia, isPending } = useMutation({
    mutationFn: createMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media successfully injected into the Multiverse!");
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create media.");
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      form.reset();
      setCastInput("");
    }, 300); // Wait for modal exit animation
  };

  // 🎯 Step Validation Guard
  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["title", "description", "releaseYear"];
    if (step === 2) fieldsToValidate = ["director", "cast"];
    if (step === 3) fieldsToValidate = ["platform", "pricing", "genreIds"];

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const handleAddCast = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = castInput.trim();
      if (val) {
        const currentCast = watch("cast") || [];
        if (!currentCast.includes(val)) {
          setValue("cast", [...currentCast, val], { shouldValidate: true });
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
      { shouldValidate: true },
    );
  };

  const toggleGenre = (id: string) => {
    const currentGenres = watch("genreIds") || [];
    if (currentGenres.includes(id)) {
      setValue(
        "genreIds",
        currentGenres.filter((g: string) => g !== id),
        { shouldValidate: true },
      );
    } else {
      setValue("genreIds", [...currentGenres, id], { shouldValidate: true });
    }
  };

  const onSubmit = (data: TMediaFormValues) => {
    submitMedia(data);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95"
      >
        <Plus className="size-4" /> Add Title
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
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
              className="relative w-full max-w-2xl bg-black/90 glass-panel border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-screen"
            >
              {/* Header & Step Indicator */}
              <div className="p-6 border-b border-white/10 bg-white/2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                      Initialize Media
                    </h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      System Nexus Uplink
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 z-0" />
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-500"
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
                            ? "bg-primary border-primary shadow-[0_0_15px_rgba(225,29,72,0.4)] text-white"
                            : "bg-white/5 border-white/10 text-white/40",
                        )}
                      >
                        <s.icon className="size-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
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
                            placeholder="e.g. Inception"
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
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
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
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
                            placeholder="Plot summary..."
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50 min-h-25 resize-none"
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
                            placeholder="e.g. Christopher Nolan"
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
                          />
                          {errors.director && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase">
                              {errors.director.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            Cast Members (Press Enter to Add)
                          </Label>
                          <Input
                            value={castInput}
                            onChange={(e) => setCastInput(e.target.value)}
                            onKeyDown={handleAddCast}
                            placeholder="Type a name and press Enter..."
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
                          />
                          {errors.cast && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase">
                              {errors.cast.message}
                            </p>
                          )}

                          {/* Cast Pills */}
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
                            placeholder="e.g. HBO Max, 20th Century Studios"
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
                          />
                          {errors.platform && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase">
                              {errors.platform.message}
                            </p>
                          )}
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
                                    })
                                  }
                                  className={cn(
                                    "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300",
                                    isSelected
                                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(225,29,72,0.2)]"
                                      : "bg-white/2 border-white/10 text-white/40 hover:bg-white/5 hover:border-white/20",
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
                          {errors.pricing && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase">
                              {errors.pricing.message}
                            </p>
                          )}
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
                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                        : "bg-white/2 border-white/10 text-white/40 hover:bg-white/10",
                                    )}
                                  >
                                    {genre.name}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {errors.genreIds && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase">
                              {errors.genreIds.message}
                            </p>
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
                            placeholder="https://..."
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
                          />
                          {errors.posterUrl && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase">
                              {errors.posterUrl.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            Secure Streaming URL (Optional)
                          </Label>
                          <Input
                            {...form.register("streamingUrl")}
                            placeholder="https://..."
                            className="bg-white/5 border-white/10 text-white focus-visible:ring-primary/50"
                          />
                          {errors.streamingUrl && (
                            <p className="text-[10px] font-bold text-rose-500 uppercase">
                              {errors.streamingUrl.message}
                            </p>
                          )}
                        </div>

                        {/* Summary Block before submitting */}
                        <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Check className="size-5" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
                              Ready for Deployment
                            </h4>
                            <p className="text-[10px] text-white/50 leading-relaxed mt-1">
                              Review all data. Upon deployment, this media will
                              be immediately accessible in the public multiverse
                              based on its designated pricing tier.
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
                  disabled={step === 1 || isPending}
                  onClick={() => setStep((p) => p - 1)}
                  className="text-white/50 hover:text-white hover:bg-white/5"
                >
                  <ChevronLeft className="size-4 mr-1" /> Back
                </Button>

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  >
                    Next Sector <ChevronRight className="size-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit as any)}
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-widest text-[10px] px-8 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                  >
                    {isPending ? "Deploying..." : "Deploy Media"}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
