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
        console.error("Login component error:", error);
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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0b0e14] px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-white/10 hover:bg-white/5 gap-2 transition-all active:scale-[0.98]"
        >
          {/* Google Icon Path remained consistent */}
          <svg className="size-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
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
