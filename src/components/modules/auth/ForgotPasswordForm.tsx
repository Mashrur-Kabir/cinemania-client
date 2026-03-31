/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/forgot-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IForgotPasswordPayload,
  forgotPasswordZodSchema,
} from "@/zod/auth.validation";
import { cn } from "@/lib/utils";

const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IForgotPasswordPayload) =>
      forgotPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: { email: "" } as IForgotPasswordPayload,
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
        if (!result.success) setServerError(result.message);
      } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) return;
        setServerError(
          "Failed to request reset. Please check your connection.",
        );
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
          <Mail className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a code to reset your
          password.
        </CardDescription>
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
          <form.Field
            name="email"
            validators={{ onChange: forgotPasswordZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="m@example.com"
                prepend={<Mail className="size-4 text-muted-foreground" />}
              />
            )}
          </form.Field>

          {serverError && (
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/20 text-destructive"
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
                pendingLabel="Sending Code..."
                disabled={!canSubmit}
                className="bg-primary hover:bg-primary/90 mt-2"
              >
                Get Verification Code
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-white/5 pt-4">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
