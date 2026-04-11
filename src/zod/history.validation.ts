import { z } from "zod";

export const logHistorySchema = z.object({
  mediaId: z.uuid("Invalid Media Selection"),
  watchedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be yyyy-mm-dd"),
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional()
    .or(z.literal("")),
  isRewatch: z.boolean(),
});

// 🎯 Dedicated Update Schema (Removes mediaId as it's immutable on your backend)
export const updateHistorySchema = logHistorySchema.omit({ mediaId: true });

export type ILogHistoryForm = z.infer<typeof logHistorySchema>;
export type IUpdateHistoryForm = z.infer<typeof updateHistorySchema>;
