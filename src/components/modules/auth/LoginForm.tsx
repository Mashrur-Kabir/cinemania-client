/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { loginZodSchema, ILoginPayload } from "@/zod/auth.validation";
import { cn } from "@/lib/utils";
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";

interface LoginFormProps {
  redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
        if (!result.success) {
          setServerError(result.message);
        }
      } catch (error: any) {
        // 🛑 CRITICAL FIX: Do not catch Next.js internal redirects
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
          return;
        }
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
        <CardTitle className="text-3xl font-black tracking-tighter">
          CINE<span className="text-primary">MANIA</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground/80 font-heading">
          Sign in to your streaming ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          suppressHydrationWarning // 🎯 THE FIX: Tells React to ignore extension-injected HTML
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
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
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                prepend={<Lock className="size-4 text-muted-foreground" />}
                append={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <div className="flex justify-end">
            {/* size="sm" removed to fix TS error. Using standard className for sizing. */}
            <Link
              href="/forgot-password"
              className="text-xs text-primary font-medium hover:underline underline-offset-4 transition-all"
            >
              Forgot password?
            </Link>
          </div>

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
                pendingLabel="Authenticating..."
                disabled={!canSubmit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-white/5 pt-4">
        <p className="text-sm text-muted-foreground">
          New to CineMania?{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:text-rose-400 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
