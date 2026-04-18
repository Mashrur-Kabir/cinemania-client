import BackgroundMain from "@/components/modules/home/BackgroundMain";
import FeatureCard from "@/components/modules/home/FeatureCard";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, Layout } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import TrendingSection from "@/components/modules/home/TrendingSection";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import PopularReviewsSection from "@/components/modules/home/PopularReviewsSection";
import TopRatedSection from "@/components/modules/home/TopRatedSection";
import NewArrivalsSection from "@/components/modules/home/NewArrivalsSection";
import { getNewArrivals } from "@/services/home.services";
import HeroPosterStage from "@/components/modules/home/HeroPosterStage";
import ExploreAllMovies from "@/components/modules/home/ExploreAllMovies";
import { getAllMedia } from "@/services/media.services";
import { HomeSection } from "@/components/modules/home/HomeSection";
import PricingCard from "@/components/modules/home/PricingCard";

export default async function HomePage() {
  // 1. Fetch 6 newest posters for the background
  const { data: arrivals } = await getNewArrivals();
  const posterUrls =
    arrivals?.map(
      (m) =>
        m.posterUrl ||
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000",
    ) || [];

  return (
    <div className="relative min-h-screen overflow-hidden pb-32">
      <BackgroundMain />

      {/* 🎬 The 16:9 Hero Stage */}
      <HeroPosterStage posters={posterUrls} />

      {/* Hero content starts lower to accent the 16:9 view */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center px-6 pt-48 md:pt-64">
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
        {/* WAVE 3: Features - CLOSE THIS DIV AFTER THE 3 CARDS */}
        <div className="motion-reveal motion-delay-3 grid w-full grid-cols-1 gap-8 pt-24 md:grid-cols-3">
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
        </div>{" "}
        {/* 🎯 Subscription */}
        <div className="mt-40 w-full">
          <HomeSection
            title="ELEVATE YOUR EXPERIENCE"
            subtitle="Unlock Our Exclusive Plans to Access More."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                type="BASIC"
                price="9.99"
                features={["720p Streaming", "No Ads", "10 Monthly Reviews"]}
              />
              <PricingCard
                type="PRO"
                price="19.99"
                features={[
                  "1080p Streaming",
                  "Early Access",
                  "Unlimited Reviews",
                ]}
              />
              <PricingCard
                type="PREMIUM"
                price="29.99"
                features={[
                  "4K Ultra HD",
                  "Priority Support",
                  "Exclusive Achievement Badges",
                ]}
              />
            </div>
          </HomeSection>
        </div>
        {/* WAVE 4: The Dynamic Data Stream - NOW OUTSIDE THE GRID */}
        <div className="mt-40 w-full space-y-40 text-left">
          {/* Trending Section */}
          <Suspense fallback={<SectionSkeleton count={6} />}>
            <TrendingSection />
          </Suspense>

          {/* Popular Reviews Section */}
          <Suspense
            fallback={<SectionSkeleton count={2} className="md:grid-cols-2" />}
          >
            <PopularReviewsSection />
          </Suspense>

          {/* 3. Top Rated Section */}
          <Suspense fallback={<SectionSkeleton count={6} />}>
            <TopRatedSection />
          </Suspense>

          {/* 4. New Arrivals Section */}
          <Suspense fallback={<SectionSkeleton count={6} />}>
            <NewArrivalsSection />
          </Suspense>

          {/*Explore All Movies Section*/}
          <Suspense fallback={<SectionSkeleton count={6} />}>
            <ExploreMoviesDataLayer />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// This keeps the HomePage clean and allows Suspense to work perfectly.
async function ExploreMoviesDataLayer() {
  const { data: mediaItems } = await getAllMedia({ limit: 12 });
  return <ExploreAllMovies mediaItems={mediaItems || []} />;
}
