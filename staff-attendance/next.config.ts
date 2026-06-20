import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default "bottom-left" sits on top of the sidebar's Log out button.
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
