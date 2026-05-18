import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  // Produce a standalone output for production deployments where useful
  output: "standalone",
};

export default nextConfig;
