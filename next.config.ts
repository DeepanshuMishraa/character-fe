import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // async rewrites() {
  //   return [
  //     // {
  //     //   source: '/api/:path*',
  //     //   destination: 'https://chat-backend-vve1.onrender.com/api/:path*'
  //     // }
  //     {
  //       source: '/api/:path*',
  //       destination: process.env.NEXT_BACKEND_URL as string
  //     }
  //   ];
  // }
};

export default nextConfig;
