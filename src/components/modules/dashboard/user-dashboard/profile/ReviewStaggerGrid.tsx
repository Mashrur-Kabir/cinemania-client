"use client";

import { motion, Variants } from "framer-motion";
import { IReview } from "@/types/review.types";
import PublicReviewCard from "./PublicReviewCard";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ReviewStaggerGrid({ reviews }: { reviews: IReview[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {reviews.map((review) => (
        <motion.div key={review.id} variants={itemVariants} className="h-full">
          <PublicReviewCard review={review} />
        </motion.div>
      ))}
    </motion.div>
  );
}
