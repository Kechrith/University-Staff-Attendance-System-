import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Department Head dashboard now lives at its own route; send the
      // site root there until other role-based dashboards exist.
      {
        source: "/",
        destination: "/Department-Head/Dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
