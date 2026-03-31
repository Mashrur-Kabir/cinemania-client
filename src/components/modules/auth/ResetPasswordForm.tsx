/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import { resetPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/reset-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  resetPasswordZodSchema,
  IResetPasswordPayload,
} from "@/zod/auth.validation";
import { cn } from "@/lib/utils";

const ResetPasswordForm = ({ email }: { email: string }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IResetPasswordPayload) =>
      resetPasswordAction(payload),
  });

  // Generic removed to fix 'Expected 12 type arguments'
  const form = useForm({
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    } as IResetPasswordPayload, // Type inference via casting
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
        if (!result.success) setServerError(result.message);
      } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) return;
        setServerError("An unexpected error occurred.");
      }
    },
  });

  return (
    <Card
      className={cn(
        "w-full max-w-md border-white/5 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(225,29,72,0.3)]",
        "animate-in fade-in zoom-in duration-500",
      )}
    >
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit border border-primary/20 mb-2">
          <KeyRound className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create New Password
        </CardTitle>
        <CardDescription>Enter the code sent to {email}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="otp">
            {(field) => (
              <div className="flex flex-col items-center gap-2 mb-4">
                <InputOTP
                  maxLength={6}
                  value={field.state.value}
                  onChange={field.handleChange}
                >
                  <InputOTPGroup className="gap-2">
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="bg-white/[0.03] border-white/10 size-11 text-lg rounded-md focus:ring-primary/40"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type="password"
                placeholder="••••••••"
                prepend={<Lock className="size-4 text-muted-foreground" />}
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: resetPasswordZodSchema.shape.confirmPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                prepend={
                  <ShieldCheck className="size-4 text-muted-foreground" />
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/20 text-destructive animate-in slide-in-from-top-2"
            >
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Updating Password..."
                disabled={!canSubmit}
                className="bg-primary hover:bg-primary/90 mt-4"
              >
                Update Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
