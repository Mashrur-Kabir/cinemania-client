// src/components/modules/dashboard/user-dashboard/security/ChangePasswordForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { changePasswordSchema } from "@/zod/security.validation";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { ShieldCheck, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { changePasswordAction } from "@/app/_actions/security.action";

export default function ChangePasswordForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm({
    defaultValues: { oldPassword: "", newPassword: "" },
    validators: { onChange: changePasswordSchema },
    onSubmit: async ({ value }) => {
      const res = await changePasswordAction(value);
      if (res.success) {
        toast.success("Security status updated", {
          description: "Your password has been changed across all timelines.",
        });
        form.reset();
      } else {
        toast.error(res.message);
      }
    },
  });

  return (
    <div className="mx-auto w-full rounded-[2.5rem] p-8 border border-white/5 bg-black/40 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <ShieldCheck className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Credentials Access
          </h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            Update your master security key
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.Field name="oldPassword">
          {(field) => (
            <AppField
              field={field}
              label="Current Password"
              type={showOld ? "text" : "password"}
              prepend={<Lock className="size-4" />}
              append={
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  {showOld ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
            />
          )}
        </form.Field>

        <form.Field name="newPassword">
          {(field) => (
            <AppField
              field={field}
              label="New Security Key"
              type={showNew ? "text" : "password"}
              prepend={<KeyRound className="size-4" />}
              append={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  {showNew ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
            />
          )}
        </form.Field>

        <div className="pt-4">
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting}
                disabled={!canSubmit}
                className="w-full sm:w-auto px-12 rounded-2xl"
              >
                Update Credentials
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
