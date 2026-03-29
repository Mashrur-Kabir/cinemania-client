import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import QueryProviders from "@/providers/queryProvider";
import { fontSans, fontHeading, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/utils"; // Uses your existing utility
import "./globals.css";

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
        <QueryProviders>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProviders>
      </body>
    </html>
  );
}
