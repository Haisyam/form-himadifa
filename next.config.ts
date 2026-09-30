import type { NextConfig } from "next";

// Set timezone to Asia/Jakarta for Node process environment
process.env.TZ = "Asia/Jakarta";

const nextConfig: NextConfig = {
  env: {
    TZ: "Asia/Jakarta",
  },
};

export default nextConfig;
