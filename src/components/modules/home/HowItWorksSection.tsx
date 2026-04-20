import { Search, Star, Trophy } from "lucide-react";
import { HomeSection } from "./HomeSection";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Browse thousands of titles across every major streaming platform, all in one unified feed.",
    color: "text-primary",
    glow: "rgba(225,29,72,0.2)",
    border: "rgba(225,29,72,0.25)",
  },
  {
    number: "02",
    icon: Star,
    title: "Review",
    description:
      "Write detailed reviews, rate titles, leave comments, and build your critical reputation.",
    color: "text-accent",
    glow: "rgba(168,85,247,0.2)",
    border: "rgba(168,85,247,0.25)",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Earn",
    description:
      "Hit milestones and unlock 20+ exclusive achievement badges as you watch and engage.",
    color: "text-amber-400",
    glow: "rgba(251,191,36,0.2)",
    border: "rgba(251,191,36,0.25)",
  },
];

export default function HowItWorksSection() {
  return (
    <HomeSection
      title="HOW IT WORKS"
      subtitle="Three steps to your cinematic social life."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connector line — desktop only */}
        <div
          className="hidden md:block absolute top-[52px] left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px"
          style={{
            background:
              "linear-gradient(to right, rgba(225,29,72,0.3), rgba(168,85,247,0.3), rgba(251,191,36,0.3))",
          }}
        />

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center p-8 rounded-3xl border bg-white/[0.025] backdrop-blur-xl"
              style={{
                borderColor: step.border,
                boxShadow: `0 0 40px -12px ${step.glow}`,
              }}
            >
              {/* Number badge */}
              <div
                className="absolute -top-3 left-8 text-[10px] font-black tracking-[0.25em] px-2 py-0.5 rounded-full border"
                style={{
                  borderColor: step.border,
                  color: step.color.replace("text-", ""),
                  background: "#030406",
                }}
              >
                {step.number}
              </div>

              {/* Icon ring */}
              <div
                className="relative mb-6 size-14 flex items-center justify-center rounded-full border"
                style={{ borderColor: step.border, background: `${step.glow}` }}
              >
                <Icon className={`size-6 ${step.color}`} />
                {/* Pulse ring */}
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{
                    background: step.glow,
                    animationDuration: `${2.5 + i * 0.4}s`,
                  }}
                />
              </div>

              <h3 className={`text-xl font-black mb-3 ${step.color}`}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </HomeSection>
  );
}
