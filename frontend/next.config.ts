import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // albo 127.0.0.1
        port: '9090',          // jeśli obrazki są na innym porcie
        pathname: '/images/**',
      },
    ],
    }
};

export default nextConfig;
