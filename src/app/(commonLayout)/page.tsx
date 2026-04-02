import BackgroundMain from "@/components/shared/background/BackgroundMain";
import FeatureCard from "@/components/modules/home/FeatureCard";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, Layout } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import TrendingSection from "@/components/modules/home/TrendingSection";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 pt-24 pb-12">
      <BackgroundMain />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        {/* WAVE 1: Branding & Title */}
        <div className="motion-reveal motion-delay-1 space-y-6">
          <div className="hero-kicker">
            <Star className="size-3 fill-current" />
            The Social Streaming Revolution
          </div>

          <h1 className="font-heading text-6xl font-black leading-[0.9] tracking-tighter text-white md:text-8xl">
            YOUR UNIVERSE. <br />
            <span className="bg-gradient-to-r from-primary via-rose-400 to-accent bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(225,29,72,0.3)]">
              ONE SCREEN.
            </span>
          </h1>
        </div>

        {/* WAVE 2: Description & Buttons */}
        <div className="motion-reveal motion-delay-2 mt-8 space-y-8">
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground/90 md:text-xl">
            Aggregating all your favorite streaming services into a single
            social ecosystem. Review, discuss, and earn achievements while you
            watch.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="neo-button-primary h-14 px-10 text-base"
            >
              <Link href="/register">
                <Play className="mr-2 size-5 fill-current" />
                Start Watching
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="neo-button-secondary h-14 px-10 text-base"
            >
              <Link href="/discovery">Browse Community</Link>
            </Button>
          </div>
        </div>

        {/* WAVE 3: Features */}
        <div className="motion-reveal motion-delay-3 grid grid-cols-1 gap-8 pt-24 md:grid-cols-3">
          <FeatureCard
            variant="primary"
            icon={Users}
            title="Social Watch Party"
            description="Track what your friends are watching in real-time."
          />
          <FeatureCard
            variant="accent"
            icon={Star}
            title="Achievement Engine"
            description="Unlock 20+ cinematic trophies as you hit milestones."
          />
          <FeatureCard
            variant="white"
            icon={Layout}
            title="Centralized Streaming"
            description="One login for all content providers."
          />

          {/* WAVE 4: The Dynamic Data Stream */}
          <div className="mt-32 w-full space-y-32">
            <Suspense fallback={<SectionSkeleton count={6} />}>
              <TrendingSection />
            </Suspense>

            {/* We will add PopularReviewsSection here later */}
          </div>
        </div>
      </main>
    </div>
  );
}
