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
  const variantClasses = {
    primary: "feature-card--primary text-primary",
    accent: "feature-card--accent text-accent",
    white: "feature-card--white text-white",
  };

  return (
    <div
      className={cn(
        "feature-card glass-panel group relative overflow-hidden p-8",
        variantClasses[variant],
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
        <Icon className="relative size-10 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110 will-change-transform" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
