import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "primary" | "accent" | "white";
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  variant,
}: FeatureCardProps) => {
  const variants = {
    primary:
      "hover:border-primary/40 hover:shadow-[0_0_30px_-5px_rgba(225,29,72,0.35)] text-primary",
    accent:
      "hover:border-accent/40 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] text-accent",
    white:
      "hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.12)] text-white",
  };

  return (
    <div
      className={cn(
        "glass-panel group relative overflow-hidden p-8 transition-all duration-500 hover:-translate-y-1",
        variants[variant],
      )}
    >
      <div className="relative mb-6 inline-block">
        <div
          className={cn(
            "absolute inset-0 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            variant === "primary" && "bg-primary/50",
            variant === "accent" && "bg-accent/50",
            variant === "white" && "bg-white/20",
          )}
        />
        <Icon className="relative size-10 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110" />
      </div>

      <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-white/95">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-muted-foreground/85">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
