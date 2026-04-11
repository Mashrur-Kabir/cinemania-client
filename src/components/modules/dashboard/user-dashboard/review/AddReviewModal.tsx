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
  ChevronLeft,
  ShieldAlert,
  MessageSquareText,
  Hash, // 🎯 Icon for tags
} from "lucide-react"; // 🎯 Removed unused Clapperboard
import { useDebounce } from "@/hooks/use-debounce";
import { getAllMedia } from "@/services/media.services";
import { reviewSchema, type IReviewForm } from "@/zod/review.validation";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TMediaPreview } from "@/types/media.types";
import StarRating from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { createReviewAction } from "@/app/_actions/review.action";

export default function AddReviewModal() {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<TMediaPreview | null>(
    null,
  );
  const [text, setText] = useState("");
  const [tagInput, setTagInput] = useState("");

  const debouncedSearch = useDebounce(text, 400);
  const queryClient = useQueryClient();

  const { data: mediaResponse, isLoading: isSearching } = useQuery({
    queryKey: ["media-search", debouncedSearch],
    queryFn: () => getAllMedia({ searchTerm: debouncedSearch, limit: 5 }),
    enabled: open && !selectedMedia,
  });

  const { mutateAsync: postReview, isPending } = useMutation({
    mutationFn: createReviewAction,
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
        handleClose();
      } else {
        toast.error(res.message);
      }
    },
  });

  const form = useForm({
    defaultValues: {
      mediaId: "",
      rating: 5,
      content: "",
      isSpoiler: false,
      tags: [],
    } as IReviewForm,
    onSubmit: async ({ value }) => {
      if (!selectedMedia) return;
      const result = reviewSchema.safeParse({
        ...value,
        mediaId: selectedMedia.id,
      });

      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      await postReview(result.data);
    },
  });

  const handleClose = () => {
    setOpen(false);
    setSelectedMedia(null);
    setText("");
    setTagInput("");
    form.reset();
  };

  // 🎯 FIX: Added defensive check (field.state.value || []) to prevent undefined crash
  const handleAddTag = (e: React.KeyboardEvent, field: any) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = field.state.value || [];
      if (!currentTags.includes(tagInput.trim())) {
        field.handleChange([...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string, field: any) => {
    const currentTags = field.state.value || [];
    field.handleChange(currentTags.filter((t: string) => t !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? handleClose() : setOpen(v))}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)]">
          <Plus className="size-4" /> Drop a Review
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] bg-[#030406]/95 border-white/5 backdrop-blur-3xl p-0 overflow-hidden rounded-[2.5rem] shadow-2xl focus:outline-none [&>button]:hidden">
        <DialogClose className="absolute right-8 top-8 z-50 rounded-full p-2 text-white/30 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
          <X className="size-5" />
        </DialogClose>

        {!selectedMedia ? (
          <div className="p-10 animate-in fade-in duration-500">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-white italic uppercase text-center">
                WRITE A <span className="text-accent">CRITIQUE.</span>
              </DialogTitle>
            </DialogHeader>
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Which title are we reviewing?"
                className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-accent/20"
              />
            </div>
            <div className="min-h-[350px] mt-6 space-y-3">
              {isSearching ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-accent" />
                </div>
              ) : (
                mediaResponse?.data?.map((media: any) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedMedia(media)}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-accent/10 transition-all text-left group"
                  >
                    <div className="relative h-14 aspect-[2/3] rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={media.posterUrl || ""}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-white group-hover:text-accent transition-colors">
                      {media.title}
                    </h4>
                    <Plus className="ml-auto size-4 opacity-30" />
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
              <Image
                src={selectedMedia.posterUrl || ""}
                alt=""
                fill
                className="object-cover opacity-10 blur-xl scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030406] to-transparent" />
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase text-white/50 hover:text-accent transition-colors z-20"
              >
                <ChevronLeft className="size-4" /> Change Movie
              </button>

              <div className="absolute top-6 inset-0 flex items-center gap-6 px-10 pt-10">
                <div className="relative h-28 aspect-[2/3] rounded-xl overflow-hidden border border-accent/50 shadow-[0_0_30px_rgba(56,189,248,0.2)] shrink-0">
                  <Image
                    src={selectedMedia.posterUrl || ""}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter leading-none pt-4">
                  {selectedMedia.title}
                </DialogTitle>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="p-10 pt-6 space-y-6"
            >
              <form.Field name="rating">
                {(field) => (
                  <StarRating
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>

              <form.Field name="content">
                {(field) => (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      The Critique
                    </label>
                    <div className="relative group mt-2">
                      <MessageSquareText className="absolute left-4 top-4 size-4 text-accent/40 group-focus-within:text-accent transition-colors" />
                      <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Was it a masterpiece or a disaster?"
                        className="w-full min-h-[140px] bg-white/[0.03] border border-white/10 rounded-2xl p-5 pl-12 text-sm focus:border-accent/50 outline-none transition-all placeholder:text-white/5"
                      />
                    </div>
                  </div>
                )}
              </form.Field>

              {/* 🎯 TAGS INPUT SECTION */}
              <form.Field name="tags">
                {(field) => (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      Context Tags
                    </label>
                    <div className="relative group mt-2">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-accent/40 group-focus-within:text-accent transition-colors" />
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => handleAddTag(e, field)}
                        placeholder="Type and press Enter to add tags..."
                        className="h-12 bg-white/[0.03] border-white/10 rounded-xl pl-12 focus:ring-accent/20"
                      />
                    </div>
                    {/* 🎯 FIX: Used (field.state.value || []) to prevent undefined property access */}
                    {(field.state.value || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(field.state.value || []).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-accent/10 text-accent border-accent/20 gap-1 pr-1 pl-3 py-1 text-[10px] font-bold"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag, field)}
                              className="p-0.5 hover:bg-accent/20 rounded-full transition-colors"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <ShieldAlert
                    className={cn(
                      "size-5 transition-colors",
                      form.getFieldValue("isSpoiler")
                        ? "text-rose-500"
                        : "text-white/20",
                    )}
                  />
                  <div>
                    <p className="text-[10px] font-black uppercase text-white">
                      Contains Spoilers?
                    </p>
                    <p className="text-[9px] text-muted-foreground italic">
                      Warn others in the multiverse.
                    </p>
                  </div>
                </div>
                <form.Field name="isSpoiler">
                  {(field) => (
                    <button
                      type="button"
                      onClick={() => field.handleChange(!field.state.value)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        field.state.value ? "bg-rose-500" : "bg-white/10",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 size-4 bg-white rounded-full transition-all",
                          field.state.value ? "left-7" : "left-1",
                        )}
                      />
                    </button>
                  )}
                </form.Field>
              </div>

              <AppSubmitButton
                isPending={isPending}
                pendingLabel="Broadcasting..."
                className="h-14 rounded-2xl bg-accent text-black hover:bg-accent/80 font-black uppercase tracking-[0.2em]"
              >
                Publish Review
              </AppSubmitButton>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
