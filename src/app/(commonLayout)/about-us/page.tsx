import { Film, Users, Globe2 } from "lucide-react";

export const metadata = {
  title: "About Us | Cinemania",
  description: "Learn more about the vision and mission behind Cinemania.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-heading">
            Welcome to the <span className="text-[#FF00FF]">Multiverse</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Cinemania isn&apos;t just a streaming platform. It&apos;s a living,
            breathing community built for true cinephiles. We bridge the gap
            between watching a masterpiece and sharing that exact feeling with
            the world.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 mt-20">
          <div className="flex flex-col items-center text-center p-6 border border-zinc-800 bg-[#2D0B3E]/10 rounded-none transition-colors hover:border-[#FF00FF]/50">
            <div className="flex h-16 w-16 items-center justify-center bg-[#FF00FF]/10 text-[#FF00FF] mb-6">
              <Film className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Limitless Library
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              From timeless classics to bleeding-edge indie films, our
              centralized streaming hub brings every universe to your screen in
              pristine quality.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border border-zinc-800 bg-[#2D0B3E]/10 rounded-none transition-colors hover:border-[#FF00FF]/50">
            <div className="flex h-16 w-16 items-center justify-center bg-[#FF00FF]/10 text-[#FF00FF] mb-6">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Social Sync
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Log your diaries, review every frame, unlock cinematic badges, and
              host real-time watch parties with friends across the globe.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border border-zinc-800 bg-[#2D0B3E]/10 rounded-none transition-colors hover:border-[#FF00FF]/50">
            <div className="flex h-16 w-16 items-center justify-center bg-[#FF00FF]/10 text-[#FF00FF] mb-6">
              <Globe2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Global Discovery
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Break out of the algorithm. Find your next favorite movie through
              community-curated lists and trending reviews from trusted critics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
