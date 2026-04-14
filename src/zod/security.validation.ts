// src/zod/security.validation.ts
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * 🛠️ Change Password Schema
 * Aligned with backend 'changePasswordValidationSchema' logic
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
  });

export type IChangePasswordPayload = z.infer<typeof changePasswordSchema>;
