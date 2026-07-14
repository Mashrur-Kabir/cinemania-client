/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { IComment } from "@/types/review.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  Reply,
  Trash2,
  CornerDownRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentAction } from "@/app/_actions/comment.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentInput from "./CommentInput";

export default function CommentItem({
  comment,
  reviewId,
}: {
  comment: IComment;
  reviewId: string;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: () => deleteCommentAction(comment.id, reviewId),
    onSuccess: (res: any) => {
      if (res.success || res.message?.includes("successfully")) {
        toast.success("Comment deleted", {
          icon: <CheckCircle2 className="size-4 text-emerald-500" />,
          className:
            "bg-surface/95 border border-border text-foreground rounded-2xl shadow-lg",
        });
        queryClient.invalidateQueries({ queryKey: ["review", reviewId] });
      } else {
        toast.error(res.message || "Failed to terminate signal.", {
          icon: <AlertCircle className="size-4 text-rose-500" />,
          className:
            "bg-surface/95 border border-border text-foreground rounded-2xl shadow-lg",
        });
      }
    },
  });

  return (
    <div className="group/item">
      <div className="flex gap-4">
        {/* Visual Connectors */}
        <div className="flex flex-col items-center shrink-0">
          <Avatar className="size-10 border border-border/30 ring-2 ring-transparent group-hover/item:ring-primary/20 transition-all">
            <AvatarImage src={comment.user.image || ""} />
            <AvatarFallback className="bg-surface/80 font-black text-xs">
              {comment.user.name[0]}
            </AvatarFallback>
          </Avatar>
          {comment.replies?.length > 0 && (
            <div className="w-px flex-1 bg-border/30 my-3" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="glass-panel p-5 rounded-[1.5rem] border-border/20 bg-surface/[0.08] group-hover/item:bg-surface/[0.12] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-foreground uppercase tracking-wider">
                {comment.user.name}
              </span>
              <div className="flex items-center gap-3">
                {/* suppressHydrationWarning avoids the relative-time mismatch on hydration */}
                <span
                  className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter"
                  suppressHydrationWarning
                >
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
                <button
                  onClick={() => handleDelete()}
                  disabled={isPending}
                  className={cn(
                    "opacity-0 group-hover/item:opacity-100 text-muted-foreground/30 hover:text-rose-500 transition-all scale-90 hover:scale-100",
                    isPending && "opacity-100",
                  )}
                >
                  {isPending ? (
                    <div className="size-3.5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-[13px] text-foreground/85 leading-relaxed font-medium">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-5 px-1">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className={cn(
                "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors",
                isReplying
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Reply className={cn("size-3", isReplying && "fill-current")} />
              {isReplying ? "Cancel Reply" : "Reply to comment"}
            </button>
          </div>

          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden pt-2"
              >
                <div className="flex gap-3">
                  <div className="pt-4">
                    <CornerDownRight className="size-4 text-muted-foreground/40" />
                  </div>
                  <div className="flex-1">
                    <CommentInput
                      reviewId={reviewId}
                      parentId={comment.id}
                      onSuccess={() => setIsReplying(false)}
                      placeholder={`Drafting reply to ${comment.user.name}...`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {comment.replies?.length > 0 && (
            <div className="pt-6 pl-4 border-l border-border/20 space-y-8">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  reviewId={reviewId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
