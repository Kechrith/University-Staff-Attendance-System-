import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default "bottom-left" sits on top of the sidebar's Log out button.
  devIndicators: {
    position: "bottom-right",
  },
  // Allow development access from local network IPs (e.g., Radmin VPN or mobile test)
  allowedDevOrigins: ["26.213.171.81", "localhost:3000", "127.0.0.1:3000"],
  // A stray lockfile one directory up makes Next.js infer the workspace root
  // as the parent folder, which then has Turbopack watch that entire tree.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

