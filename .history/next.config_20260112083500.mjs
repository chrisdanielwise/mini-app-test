/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,

  // 🏛️ NODE OPTIMIZATION: Essential for Prisma performance at scale
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // 🛠️ TUNNEL AUTHORIZATION: Permitting secure external ingress for development
  allowedDevOrigins: isProd ? [] : ['*.ngrok-free.app', 'localhost:3000'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'telegram.org' },
      { protocol: 'https', hostname: '*.neon.tech' },
      { protocol: 'https', hostname: 'utfs.io' },
    ],
  },

  async headers() {
    let frameAncestors = "https://web.telegram.org https://t.me";
    if (!isProd) frameAncestors += " http://localhost:3000";

    return [{
      source: '/(.*)',
      headers: [
        { 
          key: 'Content-Security-Policy', 
          // 🚀 FIXED: Combined directives into a single valid string. 
          // Added 'unsafe-inline' to fix the script violation shown in your logs.
          value: `default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; frame-ancestors ${frameAncestors}; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';` 
        },
        { key: 'ngrok-skip-browser-warning', value: 'true' },
        // 🛡️ NOTE: If you use frame-ancestors, X-Frame-Options must be SAMEORIGIN or removed
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    }];
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverActions: { bodySizeLimit: '2mb' },
  },
};

export default nextConfig;