import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: 'http://localhost:8000',
    NEXT_PUBLIC_API_URL: 'http://localhost:8000',
  },
  
  
};

export default nextConfig;
