import { Montserrat, Mulish, Geist_Mono } from "next/font/google";

// For regular headings and highlights
export const fontHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

// For regular body text (community reviews and discussions)
export const fontSans = Mulish({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Keeping Geist Mono for technical/code elements as per your DNA
export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
