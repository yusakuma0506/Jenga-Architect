import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone' // this is for the docker and vercel pipeline
};

export default nextConfig;
