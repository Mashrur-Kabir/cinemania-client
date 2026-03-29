import { Button } from "@/components/ui/button";
import { Play, Star, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 -z-10 h-[400px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-1/4 -z-10 h-[300px] w-[500px] rounded-full bg-accent/20 blur-[100px]" />

      <main className="max-w-5xl text-center space-y-8">
        {/* Branding/Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase animate-in fade-in slide-in-from-bottom-3 duration-700">
          <Star className="size-3 fill-current" />
          The Future of Streaming
        </div>

        {/* Hero Title */}
        <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
          Your Universe. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-400 to-accent">
            One Single Screen.
          </span>
        </h1>

        <p className="font-heading max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
          Aggregating all your favorite streaming services into a single social
          ecosystem. Review, discuss, and earn achievements while you watch.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 h-12 text-base font-semibold shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all"
          >
            <Link href="/register">
              <Play className="mr-2 size-4 fill-current" />
              Start Watching
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-12 text-base border-white/10 hover:bg-white/5"
          >
            <Link href="/discovery">Browse Community</Link>
          </Button>
        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-left hover:border-primary/30 transition-colors group">
            <Users className="size-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold font-heading mb-2">
              Social Watch Party
            </h3>
            <p className="text-sm text-muted-foreground">
              Track what your friends are watching in real-time with our
              5-minute activity pulse.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-left hover:border-accent/30 transition-colors group">
            <Star className="size-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold font-heading mb-2">
              Achievement Engine
            </h3>
            <p className="text-sm text-muted-foreground">
              Unlock 20+ cinematic trophies as you hit milestones and diverse
              genre counts.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-left hover:border-white/20 transition-colors group">
            <Play className="size-8 text-white mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold font-heading mb-2">
              Centralized Streaming
            </h3>
            <p className="text-sm text-muted-foreground">
              One login for all content providers. No more platform switching.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
