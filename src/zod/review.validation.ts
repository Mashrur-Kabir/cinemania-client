import { z } from "zod";

export const reviewSchema = z.object({
  mediaId: z.uuid("Please select a movie"),
  rating: z
    .number()
    .min(1, "Minimum rating is 1")
    .max(10, "Maximum rating is 10")
    .multipleOf(0.5, "Rating must be in 0.5 increments"),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000),
  isSpoiler: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export type IReviewForm = z.infer<typeof reviewSchema>;
