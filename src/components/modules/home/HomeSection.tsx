import { cn } from "@/lib/utils";

interface HomeSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const HomeSection = ({
  title,
  subtitle,
  children,
  className,
}: HomeSectionProps) => (
  <section className={cn("w-full space-y-8 motion-reveal", className)}>
    <div className="flex flex-col items-start gap-2">
      <h2 className="font-heading text-3xl font-black tracking-tighter text-white md:text-4xl">
        {title.split(" ")[0]}{" "}
        <span className="text-primary">
          {title.split(" ").slice(1).join(" ")}
        </span>
      </h2>
      {subtitle && (
        <p className="text-muted-foreground font-medium">{subtitle}</p>
      )}
    </div>
    {children}
  </section>
);
