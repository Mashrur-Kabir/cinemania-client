import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "disneyplus.com", // 🎯 Matches the root (https://disneyplus.com)
      },
      {
        protocol: "https",
        hostname: "*.disneyplus.com", // 🎯 Matches subdomains (www.disneyplus.com)
      },
      {
        protocol: "https",
        hostname: "netflix.com",
      },
      {
        protocol: "https",
        hostname: "*.netflix.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org", // 🎯 Add this line
      },
      // ... repeat for others as needed
    ],
  },

  async rewrites() {
    return [
      {
        // 🎯 One rule to rule them all: Catches /api/v1/auth, /api/v1/review, etc.
        source: "/api/v1/:path*",
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
