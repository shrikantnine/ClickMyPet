import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // These rules are causing warnings but not actual errors
    // We'll disable them for build to proceed, then fix them manually
    dirs: ["src"],
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
