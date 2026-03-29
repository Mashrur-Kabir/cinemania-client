import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import QueryProviders from "@/providers/queryProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinemania | The Social Streaming Ecosystem",
  description:
    "Aggregate your streaming world. Review, discuss, and watch with the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Hardcoded 'dark' class for cinematic consistency
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-grid-pattern`}
      >
        <QueryProviders>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProviders>
      </body>
    </html>
  );
}
