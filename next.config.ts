import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone' ,// this is for the docker and vercel pipeline
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tocj9khrsygrem4u.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};


export default nextConfig;
