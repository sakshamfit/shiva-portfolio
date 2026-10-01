import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // the floating development badge could be mistaken for part of the design during review
  devIndicators: false,
  images: {
    // WebP only: it decodes far faster than AVIF, so large images appear without scroll hitches
    formats: ["image/webp"],
    qualities: [70, 75, 78, 80, 82, 84, 85, 88, 90, 92],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400, 2880],
    imageSizes: [64, 128, 192, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
