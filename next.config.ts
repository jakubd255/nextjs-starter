import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  env: {
    NEXT_PUBLIC_STORAGE_PROVIDER: process.env.STORAGE_PROVIDER ?? (process.env.VERCEL ? "vercel-blob" : "local")
  }
  /* config options here */
};

export default nextConfig;
