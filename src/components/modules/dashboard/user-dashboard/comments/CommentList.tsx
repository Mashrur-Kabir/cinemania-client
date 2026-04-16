import { IComment } from "@/types/review.types";
import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
  reviewId,
}: {
  comments: IComment[];
  reviewId: string;
}) {
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} reviewId={reviewId} />
      ))}
    </div>
  );
}
