/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action";
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
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { cn } from "@/lib/utils";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    // Mutation is explicitly typed to your payload
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as IRegisterPayload, // Use 'as' here for initial inference if needed
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
        if (!result.success) {
          setServerError(result.message);
        }
      } catch (error: any) {
        // Robust redirect handling as per your DNA
        if (error?.digest?.startsWith("NEXT_REDIRECT")) return;
        setServerError("An unexpected error occurred. Please try again.");
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
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-black tracking-tighter text-white">
          JOIN <span className="text-primary">MANIA</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Create your account to start streaming
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                placeholder="John Doe"
                prepend={<User className="size-4 text-muted-foreground" />}
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="m@example.com"
                prepend={<Mail className="size-4 text-muted-foreground" />}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: registerZodSchema.shape.password,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type="password"
                placeholder="••••••••"
                prepend={<Lock className="size-4 text-muted-foreground" />}
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: registerZodSchema.shape.confirmPassword,
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
                pendingLabel="Creating Account..."
                disabled={!canSubmit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
              >
                Create Account
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-white/5 pt-4 text-center flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:text-rose-400 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
