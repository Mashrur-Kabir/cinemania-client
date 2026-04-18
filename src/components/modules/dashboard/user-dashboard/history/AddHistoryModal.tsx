/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  Plus,
  X,
  Calendar,
  MessageSquare,
  RotateCcw,
  ChevronLeft,
  Clapperboard,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { getAllMedia } from "@/services/media.services";
import { ILogHistoryForm, logHistorySchema } from "@/zod/history.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TMediaPreview } from "@/types/media.types";
import { logToHistoryAction } from "@/app/_actions/history.action";

export default function AddHistoryModal() {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<TMediaPreview | null>(
    null,
  );
  const [text, setText] = useState("");
  const debouncedSearch = useDebounce(text, 400);
  const queryClient = useQueryClient();

  const { data: mediaResponse, isLoading: isSearching } = useQuery({
    queryKey: ["media-search", debouncedSearch],
    queryFn: () => getAllMedia({ searchTerm: debouncedSearch, limit: 5 }),
    enabled: open && !selectedMedia,
  });

  const { mutateAsync: logMovie, isPending } = useMutation({
    mutationFn: logToHistoryAction,
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success("Entry added to your diary");
        queryClient.invalidateQueries({ queryKey: ["watchedHistory"] });
        handleClose();
      } else {
        toast.error(res.message);
      }
    },
  });

  const form = useForm({
    defaultValues: {
      mediaId: "",
      watchedAt: new Date().toISOString().split("T")[0],
      notes: "",
      isRewatch: false,
    } as ILogHistoryForm,
    onSubmit: async ({ value }) => {
      if (!selectedMedia) return;

      // 🎯 Precision: Ensure we use the selected movie ID
      const payload = { ...value, mediaId: selectedMedia.id };
      const result = logHistorySchema.safeParse(payload);

      if (!result.success) {
        toast.error("Please fill all fields correctly.");
        return;
      }
      await logMovie(result.data);
    },
  });

  const handleClose = () => {
    setOpen(false);
    setSelectedMedia(null);
    setText("");
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => (!val ? handleClose() : setOpen(val))}
    >
      <DialogTrigger asChild>
        <div className="flex justify-center mt-6">
          <button
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(225,29,72,0.4)]",
              // 🎯 THE FIX: Hardware acceleration & optimized rendering
              "transition-all duration-300 ease-out transform-gpu will-change-transform [backface-visibility:hidden]",
              "hover:scale-105 active:scale-95",
            )}
          >
            <Plus className="size-4" /> Log a Movie
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] bg-[#030406]/95 border-white/5 backdrop-blur-3xl p-0 overflow-hidden rounded-[2.5rem] shadow-2xl focus:outline-none [&>button]:hidden">
        <DialogClose className="absolute right-8 top-8 z-50 rounded-full p-2 text-white/30 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
          <X className="size-5" />
        </DialogClose>

        {!selectedMedia ? (
          /* --- STATE 1: SEARCH --- */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DialogHeader className="p-10 pb-6 border-b border-white/5">
              <DialogTitle className="text-3xl font-black text-white tracking-tighter italic uppercase text-center">
                WHICH UNIVERSE{" "}
                <span className="text-primary">DID YOU VISIT?</span>
              </DialogTitle>
              <div className="relative mt-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Search movies to log..."
                  className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20"
                />
              </div>
            </DialogHeader>

            <div className="min-h-[400px] p-10 pt-6 space-y-4">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <Loader2 className="size-10 animate-spin text-primary" />
                </div>
              ) : (
                mediaResponse?.data?.map((media: TMediaPreview) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedMedia(media)}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all text-left group"
                  >
                    <div className="relative h-16 aspect-[2/3] rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={media.posterUrl || ""}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                        {media.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">
                        {media.releaseYear}
                      </p>
                    </div>
                    <Plus className="size-5 text-muted-foreground group-hover:text-primary" />
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          /* --- STATE 2: REFINED LOGGING FORM --- */
          <div className="animate-in zoom-in-95 duration-500">
            <DialogHeader className="relative h-44 w-full p-0 space-y-0 overflow-hidden">
              <Image
                src={selectedMedia.posterUrl || ""}
                alt=""
                fill
                className="object-cover opacity-10 blur-xl scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030406] to-transparent" />

              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase text-white/50 hover:text-primary transition-colors z-20"
              >
                <ChevronLeft className="size-4" /> Change Movie
              </button>

              <div className="absolute inset-0 flex items-center gap-6 px-10 pt-16">
                <div className="relative h-28 aspect-[2/3] rounded-xl overflow-hidden border border-primary/50 shadow-[0_0_30px_rgba(225,29,72,0.3)] shrink-0">
                  <Image
                    src={selectedMedia.posterUrl || ""}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start gap-1 pb-2">
                  <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                    {selectedMedia.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mt-1">
                    <Clapperboard className="size-3 text-primary" />
                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">
                      Logging Entry
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <form.Field name="watchedAt">
                  {(field) => (
                    <AppField
                      field={field}
                      label="Watched Date"
                      type="date"
                      className="flex-1"
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
                pendingLabel="Logging..."
                className="h-12 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10"
              >
                Confirm Diary Entry
              </AppSubmitButton>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
