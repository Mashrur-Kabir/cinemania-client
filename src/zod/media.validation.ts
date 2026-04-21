import { z } from "zod";

// Pricing enum matching your backend Prisma enum
const PricingEnum = z.enum(["FREE", "BASIC", "PRO", "PREMIUM"]);

export const mediaValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z
    .string()
    .min(
      10,
      "Description must be at least 10 characters to provide adequate context.",
    ),

  releaseYear: z.coerce
    .number()
    .int("Year must be a whole number")
    .min(1800, "Year must be 1800 or later")
    .max(
      new Date().getFullYear() + 5,
      "Cannot schedule releases more than 5 years in advance",
    ),

  director: z.string().min(1, "Director is required"),

  // Tag input
  cast: z
    .array(z.string().min(1, "Cast member name cannot be empty"))
    .min(1, "At least one cast member must be registered"),

  platform: z.string().min(1, "Platform is required"),

  pricing: PricingEnum,

  posterUrl: z.url("Poster URL must be a valid URL"),

  // Optional URL fields

  streamingUrl: z
    .union([z.literal(""), z.url("Must be a valid URL")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),

  // Genre IDs
  genreIds: z
    .array(z.string())
    .min(1, "At least one genre must be mapped to this title"),
});

// 🎯 ADD THIS: Partial schema for Edit operations
export const updateMediaValidationSchema = mediaValidationSchema.partial();

export type TUpdateMediaFormValues = z.infer<
  typeof updateMediaValidationSchema
>;

export type TMediaFormValues = z.infer<typeof mediaValidationSchema>;
