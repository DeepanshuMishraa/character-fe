import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      // {
      //   source: '/api/:path*',
      //   destination: 'https://chat-backend-vve1.onrender.com/api/:path*'
      // }
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*'
      }
    ];
  }
};

export default nextConfig;
