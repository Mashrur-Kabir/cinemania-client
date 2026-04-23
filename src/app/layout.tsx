import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import QueryProviders from "@/providers/queryProvider";
import { fontSans, fontHeading, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/utils"; // Uses your existing utility
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "CineMania | The Social Streaming Ecosystem",
  description:
    "Aggregate your streaming world. Review, discuss, and watch with the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased bg-grid-pattern",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable,
        )}
      >
        {/* 🎯 THE FIX: Customized CineMania TopLoader */}
        <NextTopLoader
          color="#e11d48" // Cinematic Primary Red/Rose
          initialPosition={0.08}
          crawlSpeed={200}
          height={3} // Sleeker profile
          crawl={true}
          showSpinner={false} // Hidden spinner for a cleaner, modern look
          easing="ease"
          speed={200}
          shadow="0 0 15px #e11d48,0 0 5px #e11d48" // Intense ambient glow
          zIndex={1600} // Ensures it renders over any fixed headers/modals
        />

        <QueryProviders>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProviders>
      </body>
    </html>
  );
}
