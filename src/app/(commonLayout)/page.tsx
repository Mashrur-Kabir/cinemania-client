import { Button } from "@/components/ui/button";
import { Users, Star, Layout } from "lucide-react";
import { Suspense } from "react";
import TrendingSection from "@/components/modules/home/TrendingSection";
import SectionSkeleton from "@/components/shared/loaders/SectionSkeleton";
import PopularReviewsSection from "@/components/modules/home/PopularReviewsSection";
import TopRatedSection from "@/components/modules/home/TopRatedSection";
import NewArrivalsSection from "@/components/modules/home/NewArrivalsSection";
import ExploreAllMovies from "@/components/modules/home/ExploreAllMovies";
import { getAllMedia } from "@/services/media.services";
import { HomeSection } from "@/components/modules/home/HomeSection";
import PricingCard from "@/components/modules/home/PricingCard";
import BackgroundMain from "@/components/modules/home/BackgroundMain";
import KineticHero from "@/components/modules/home/KineticHero";
import FeatureCard from "@/components/modules/home/FeatureCard";
import HowItWorksSection from "@/components/modules/home/HowItWorksSection";
import ScrollReveal from "@/components/modules/home/ScrollReveal";

// 🎯 THE FIX: Force dynamic rendering so Next.js doesn't try to fetch data during build
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden pb-32">
      <BackgroundMain />

      {/* ── HERO: Kinetic typography, no images ── */}
      <KineticHero />

      {/* ── BELOW-FOLD SECTIONS ── */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Feature Cards */}
        <ScrollReveal y={50} rotateX={6} delay={0}>
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 mb-40">
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
          </div>
        </ScrollReveal>

        {/* How It Works */}
        <ScrollReveal y={60} rotateX={5} delay={0}>
          <div className="mb-40">
            <HowItWorksSection />
          </div>
        </ScrollReveal>

        {/* Pricing */}
        <ScrollReveal y={60} rotateX={6} delay={0}>
          <div className="mb-40">
            <HomeSection
              title="ELEVATE YOUR EXPERIENCE"
              subtitle="Unlock Our Exclusive Plans to Access More."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScrollReveal delay={0} y={50} rotateX={10} scale={0.9}>
                  <PricingCard
                    type="BASIC"
                    price="9.99"
                    features={[
                      "720p Streaming",
                      "No Ads",
                      "10 Monthly Reviews",
                    ]}
                  />
                </ScrollReveal>
                <ScrollReveal delay={120} y={50} rotateX={10} scale={0.9}>
                  <PricingCard
                    type="PRO"
                    price="19.99"
                    features={[
                      "1080p Streaming",
                      "Early Access",
                      "Unlimited Reviews",
                    ]}
                  />
                </ScrollReveal>
                <ScrollReveal delay={240} y={50} rotateX={10} scale={0.9}>
                  <PricingCard
                    type="PREMIUM"
                    price="29.99"
                    features={[
                      "4K Ultra HD",
                      "Priority Support",
                      "Exclusive Achievement Badges",
                    ]}
                  />
                </ScrollReveal>
              </div>
            </HomeSection>
          </div>
        </ScrollReveal>

        {/* Data sections */}
        <div className="w-full space-y-40 text-left">
          <ScrollReveal y={60} rotateX={5} delay={0}>
            <Suspense fallback={<SectionSkeleton count={6} />}>
              <TrendingSection />
            </Suspense>
          </ScrollReveal>

          <ScrollReveal y={60} rotateX={5} delay={0}>
            <Suspense
              fallback={
                <SectionSkeleton count={2} className="md:grid-cols-2" />
              }
            >
              <PopularReviewsSection />
            </Suspense>
          </ScrollReveal>

          <ScrollReveal y={60} rotateX={5} delay={0}>
            <Suspense fallback={<SectionSkeleton count={6} />}>
              <TopRatedSection />
            </Suspense>
          </ScrollReveal>

          <ScrollReveal y={60} rotateX={5} delay={0}>
            <Suspense fallback={<SectionSkeleton count={6} />}>
              <NewArrivalsSection />
            </Suspense>
          </ScrollReveal>

          <ScrollReveal y={60} rotateX={5} delay={0}>
            <Suspense fallback={<SectionSkeleton count={6} />}>
              <ExploreMoviesDataLayer />
            </Suspense>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}

async function ExploreMoviesDataLayer() {
  const { data: mediaItems } = await getAllMedia({ limit: 12 });
  return <ExploreAllMovies mediaItems={mediaItems || []} />;
}
