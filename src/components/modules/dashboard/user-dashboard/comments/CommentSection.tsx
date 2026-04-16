"use client";

import { IComment } from "@/types/review.types";

import { MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

interface CommentSectionProps {
  reviewId: string;
  initialComments: IComment[];
}

export default function CommentSection({
  reviewId,
  initialComments,
}: CommentSectionProps) {
  const totalComments = initialComments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0,
  );

  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-inner">
          <MessageSquareQuote className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">
            Comment Section
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {totalComments} Active Comments
          </p>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
      </div>

      {/* 🎯 Primary Input */}
      <div className="glass-panel p-1 rounded-[2rem] border-white/5 bg-white/[0.01]">
        <CommentInput reviewId={reviewId} placeholder="write a comment..." />
      </div>

      {/* 🎯 The Thread Tree */}
      <div className="pl-2">
        <CommentList reviewId={reviewId} comments={initialComments} />
      </div>
    </section>
  );
}
