import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Required for @cloudflare/next-on-pages local dev
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages
  experimental: {
    runtime: "edge",
  },
};

export default nextConfig;
