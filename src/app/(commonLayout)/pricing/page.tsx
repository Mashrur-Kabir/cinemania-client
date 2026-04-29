import { Check, X } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pricing | Cinemania",
  description: "Choose your access tier to the cinematic multiverse.",
};

const TIERS = [
  {
    name: "Basic",
    id: "tier-basic",
    href: "/pricing/basic",
    price: "$9.99",
    description: "The essential entry point for casual moviegoers.",
    features: [
      { name: "720p HD Streaming", included: true },
      { name: "Ad-Supported Viewing", included: true },
      { name: "10 Reviews & Logs / Month", included: true },
      { name: "Standard Library Access", included: true },
      { name: "Host Watch Parties", included: false },
      { name: "Offline Downloads", included: false },
      { name: "Exclusive Profile Badges", included: false },
    ],
    buttonText: "Start Basic",
    popular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/pricing/pro",
    price: "$19.99",
    description: "For the dedicated cinephile who needs more power.",
    features: [
      { name: "1080p Full HD Streaming", included: true },
      { name: "Zero Advertisements", included: true },
      { name: "Unlimited Reviews & Logs", included: true },
      { name: "Early Access to Releases", included: true },
      { name: "Host up to 5 Watch Parties", included: true },
      { name: "Offline Downloads", included: false },
      { name: "Exclusive Profile Badges", included: false },
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Premium",
    id: "tier-premium",
    href: "/pricing/premium",
    price: "$29.99",
    description: "The ultimate, unrestricted director's cut experience.",
    features: [
      { name: "4K Ultra HD + HDR Streaming", included: true },
      { name: "Zero Advertisements", included: true },
      { name: "Unlimited Reviews & Logs", included: true },
      { name: "Director's Cuts & BTS Content", included: true },
      { name: "Unlimited Watch Parties", included: true },
      { name: "Unlimited Offline Downloads", included: true },
      { name: "Exclusive Neon Profile Badges", included: true },
    ],
    buttonText: "Go Premium",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-heading">
            Choose Your <span className="text-[#FF00FF]">Access</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Whether you are a casual weekend watcher or a hardcore cinematic
            archivist, we have a tier designed for your viewing habits.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col p-8 ${
                tier.popular
                  ? "bg-[#2D0B3E]/20 border-2 border-[#FF00FF] md:-mt-8 md:mb-8"
                  : "bg-zinc-900/30 border border-zinc-800"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-[#FF00FF] px-3 py-1 text-center text-xs font-bold text-white uppercase tracking-wider drop-shadow-[0_0_8px_rgba(255,0,255,0.6)]">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-zinc-400 min-h-[40px]">
                  {tier.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">
                  {tier.price}
                </span>
                <span className="text-sm font-semibold text-zinc-400 ml-1">
                  /month
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-4 text-sm text-zinc-300">
                {tier.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-[#FF00FF] shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-zinc-600 shrink-0" />
                    )}
                    <span
                      className={
                        feature.included
                          ? "text-zinc-200"
                          : "text-zinc-600 line-through"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`mt-auto block w-full text-center py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                  tier.popular
                    ? "bg-[#FF00FF] text-white hover:bg-[#d900d9] hover:drop-shadow-[0_0_12px_rgba(255,0,255,0.6)]"
                    : "bg-transparent border border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF]/10"
                }`}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
