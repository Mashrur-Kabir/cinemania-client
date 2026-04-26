"use client";

import { motion, Variants } from "framer-motion";
import { IReview } from "@/types/review.types";
import CommunityReviewCard from "./CommunityReviewCard";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function CommunityFeed({
  initialReviews,
  currentUserId,
}: {
  initialReviews: IReview[];
  currentUserId?: string;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
    >
      {initialReviews.map((review) => (
        <motion.div key={review.id} variants={item} className="h-full">
          <CommunityReviewCard review={review} currentUserId={currentUserId} />
        </motion.div>
      ))}
    </motion.div>
  );
}
