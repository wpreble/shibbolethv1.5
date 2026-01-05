import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all hosts for Replit dynamic URLs
  allowedDevOrigins: ["*"],
  
  // Output configuration for deployments
  output: "standalone",
  
  // Disable strict mode in production for smoother experience
  reactStrictMode: true,
  
  // Image configuration - allow external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
