/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentAction } from "@/app/_actions/comment.action";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  SendHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommentInputProps {
  reviewId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export default function CommentInput({
  reviewId,
  parentId,
  onSuccess,
  placeholder,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { mutate: handlePost, isPending } = useMutation({
    mutationFn: () => createCommentAction({ content, reviewId, parentId }),
    onSuccess: (res: any) => {
      // 🎯 Robust check: handle cases where 'success' might be missing but 'data' exists
      if (res.success || res.id) {
        toast.success(parentId ? "Reply broadcasted." : "Comment published.", {
          icon: <CheckCircle2 className="size-4 text-emerald-500" />,
          className:
            "bg-[#030406] border-white/10 text-white rounded-2xl shadow-2xl",
        });
        setContent("");
        queryClient.invalidateQueries({ queryKey: ["review", reviewId] });
        onSuccess?.();
      } else {
        toast.error(res.message || "Failed to broadcast signal.", {
          icon: <AlertCircle className="size-4 text-rose-500" />,
          className:
            "bg-[#030406] border-white/10 text-white rounded-2xl shadow-2xl",
        });
      }
    },
  });

  return (
    <div className="relative group/input w-full">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className={cn(
          // 🎯 THE FIX: Added 'block' to remove the baseline gap at the bottom.
          // Added 'border-none' to prevent default browser borders from creating gaps.
          "block w-full bg-transparent p-5 pr-14 text-sm text-white placeholder:text-white/10 outline-none resize-none min-h-[80px] transition-all border-none",
          "rounded-[1.5rem] focus:bg-white/[0.02]",
        )}
      />
      <button
        disabled={!content.trim() || isPending}
        onClick={() => handlePost()}
        className={cn(
          "absolute bottom-4 right-4 size-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-out", // 🎯 Added duration & ease
          "transform-gpu will-change-transform [backface-visibility:hidden]", // 🎯 THE FIX: Hardware acceleration
          content.trim() && !isPending
            ? "bg-primary text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-110 active:scale-95" // 🎯 Increased hover scale slightly for better feel
            : "bg-white/5 text-white/10",
        )}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <SendHorizontal className="size-4" />
        )}
      </button>
    </div>
  );
}
