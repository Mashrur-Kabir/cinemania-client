/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Mail, RefreshCw } from "lucide-react";
import {
  verifyEmailAction,
  resendOtpAction,
} from "@/app/(commonLayout)/(authRouteGroup)/verify-email/_action";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const VerifyEmailForm = ({ email }: { email: string }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync: verify, isPending } = useMutation({
    mutationFn: verifyEmailAction,
  });

  const { mutateAsync: resend, isPending: isResending } = useMutation({
    mutationFn: resendOtpAction,
    onSuccess: (res) =>
      res.success && toast.success("New code sent to your email!"),
  });

  const form = useForm({
    defaultValues: { email, otp: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await verify(value);
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
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit border border-primary/20">
          <Mail className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="text-white font-medium">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6 flex flex-col items-center"
        >
          <form.Field name="otp">
            {(field) => (
              <div className="space-y-2 flex flex-col items-center">
                <InputOTP
                  maxLength={6}
                  value={field.state.value}
                  onChange={field.handleChange}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="bg-white/[0.03] border-white/10 size-12 text-lg rounded-md focus:ring-primary/40 focus:border-primary/50"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive mt-1">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
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
                pendingLabel="Verifying..."
                disabled={!canSubmit || form.state.values.otp.length !== 6}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12"
              >
                Verify & Continue
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center flex-col gap-4 pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Didn&apos;t receive code?
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resend(email)}
            disabled={isResending}
            className="text-primary font-bold p-0 hover:bg-transparent hover:text-rose-400 transition-colors"
          >
            {isResending ? (
              <RefreshCw className="size-3 animate-spin mr-1" />
            ) : null}
            Resend Code
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailForm;
