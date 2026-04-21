import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"], {
    message: "Target role is required for escalation.",
  }),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED"], {
    message: "Account status must be specified.",
  }),
});

export type TUpdateUserRoleValues = z.infer<typeof updateUserRoleSchema>;
export type TUpdateUserStatusValues = z.infer<typeof updateUserStatusSchema>;
