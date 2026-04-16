/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  X,
  ShieldAlert,
  MessageSquareText,
  Clapperboard,
  Hash,
} from "lucide-react";
import { type IReviewForm, reviewSchema } from "@/zod/review.validation";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import StarRating from "./StarRating";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IReview } from "@/types/review.types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateReviewAction } from "@/app/_actions/review.action";

const POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000";

export default function EditReviewModal({
  isOpen,
  setIsOpen,
  review,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  review: IReview;
}) {
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");

  const { mutateAsync: updateReview, isPending } = useMutation({
    mutationFn: (payload: Partial<IReviewForm>) =>
      updateReviewAction(review.id, payload),
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success("Review updated");

        // 🔥 Close FIRST
        setIsOpen(false);

        // 🔥 Delay refetch slightly to avoid flicker
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
        }, 150);
      } else {
        toast.error(res.message);
      }
    },
  });

  const form = useForm({
    defaultValues: {
      mediaId: review.mediaId,
      rating: review.rating,
      content: review.content,
      isSpoiler: review.isSpoiler,
      tags: review.tags || [],
    } as IReviewForm,
    onSubmit: async ({ value }) => {
      // 🎯 Strict Update Payload: mediaId is immutable on the backend
      const { mediaId, ...updateData } = value;

      const result = reviewSchema.partial().safeParse(updateData);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      await updateReview(result.data);
    },
  });

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

  const posterSrc = review.media?.posterUrl || POSTER_FALLBACK;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setIsOpen(false);
      }}
    >
      <DialogContent className="sm:max-w-[650px] bg-[#030406]/95 border-white/5 backdrop-blur-3xl p-0 overflow-hidden rounded-[2.5rem] shadow-2xl focus:outline-none [&>button]:hidden">
        <DialogClose className="absolute right-8 top-8 z-50 rounded-full p-2 text-white/30 hover:bg-white/10 transition-all border border-white/5">
          <X className="size-5" />
        </DialogClose>

        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* 🎭 Symmetrical Horizontal Header */}
          <DialogHeader className="relative h-44 w-full p-0 space-y-0 overflow-hidden border-b border-white/5">
            <Image
              src={posterSrc}
              alt=""
              fill
              className="object-cover opacity-10 blur-xl scale-125"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030406] to-transparent" />

            <div className="absolute inset-0 flex items-center gap-6 px-10 pt-10">
              <div className="relative h-28 aspect-[2/3] rounded-xl overflow-hidden border border-accent/50 shadow-[0_0_30px_rgba(56,189,248,0.2)] shrink-0">
                <Image
                  src={posterSrc}
                  alt={review.media?.title || "Movie Poster"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                  {review.media?.title}
                </DialogTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mt-1">
                  <Clapperboard className="size-3 text-accent" />
                  <DialogDescription className="sr-only">
                    Fill out the form below to edit your review
                  </DialogDescription>
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
                    Update Thoughts
                  </label>
                  <div className="relative group mt-2">
                    <MessageSquareText className="absolute left-4 top-4 size-4 text-accent/40 group-focus-within:text-accent transition-colors" />
                    <textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Did your perspective shift?"
                      className="w-full min-h-[140px] bg-white/[0.03] border border-white/10 rounded-2xl p-5 pl-12 text-sm focus:border-accent/50 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </form.Field>

            {/* 🎯 INTEGRATED TAGS SECTION */}
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
                      placeholder="Press Enter to update tags..."
                      className="h-12 bg-white/[0.03] border-white/10 rounded-xl pl-12 focus:ring-accent/20"
                    />
                  </div>
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
                    Spoiler Warning?
                  </p>
                  <p className="text-[9px] text-muted-foreground italic">
                    Hide content from others.
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
              pendingLabel="Updating..."
              className="h-14 rounded-2xl bg-accent text-black font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/10"
            >
              Update Critique
            </AppSubmitButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
