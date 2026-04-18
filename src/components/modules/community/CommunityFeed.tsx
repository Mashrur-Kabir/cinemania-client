"use client";

import { motion, Variants } from "framer-motion"; // 🎯 1. Import the Variants type
import { IReview } from "@/types/review.types";
import CommunityReviewCard from "./CommunityReviewCard";

// 🎯 2. Explicitly type the constants
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function CommunityFeed({
  initialReviews,
}: {
  initialReviews: IReview[];
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {initialReviews.map((review) => (
        // 🎯 3. Double-check that 'variants' is lowercase 'v'
        <motion.div key={review.id} variants={item}>
          <CommunityReviewCard review={review} />
        </motion.div>
      ))}
    </motion.div>
  );
}
