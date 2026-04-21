import { z } from "zod";

export const genreValidationSchema = z.object({
  name: z
    .string("Genre name is required")
    .min(1, "Genre name is required")
    .max(50, "Genre name is too long"),
});

export type TGenreFormValues = z.infer<typeof genreValidationSchema>;
