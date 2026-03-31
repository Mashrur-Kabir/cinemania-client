import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const registerZodSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export const verifyEmailZodSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must only contain numbers"),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
