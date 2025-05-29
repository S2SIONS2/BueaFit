import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // 경고 무시하고 빌드 계속 진행
  },
};

export default nextConfig;
