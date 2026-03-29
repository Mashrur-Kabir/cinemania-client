import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type AppSubmitButtonProps = {
  isPending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
};

const AppSubmitButton = ({
  isPending,
  children,
  pendingLabel = "Submitting...",
  className,
  disabled = false,
}: AppSubmitButtonProps) => {
  const isDisabled = disabled || isPending;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className={cn(
        "relative w-full overflow-hidden transition-all active:scale-[0.98]",
        "shadow-[0_0_20px_rgba(225,29,72,0.1)] hover:shadow-[0_0_25px_rgba(225,29,72,0.3)]",
        className,
      )}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppSubmitButton;
