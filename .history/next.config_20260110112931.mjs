/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

/**
 * 🛰️ NEXT.JS CONFIGURATION PROTOCOL (Tier 2)
 * High-resiliency settings for institutional signal nodes.
 * Optimized for Prisma 7, Telegram Mini-App integration, and Edge Tunneling.
 */
const nextConfig = {
  reactStrictMode: true,

  // 🏛️ NODE OPTIMIZATION: Bypassing bundling for Prisma clusters
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // 🛠️ TUNNEL AUTHORIZATION: Permitting secure external ingress for development
  allowedDevOrigins: isProd ? [] : ['*.ngrok-free.app', 'localhost:3000'],

  // 🏁 IMAGE INFRASTRUCTURE: Institutional remote source mapping
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },          // Telegram CDN
      { protocol: 'https', hostname: 'telegram.org' },  // Telegram Core
      { protocol: 'https', hostname: '*.neon.tech' },   // Database Visualization
      { protocol: 'https', hostname: 'utfs.io' },      // UploadThing Asset Node
    ],
  },

  // 🛡️ SECURITY HEADERS & TELEGRAM HANDSHAKE
  async headers() {
    let frameAncestors = "https://web.telegram.org https://t.me";
    if (!isProd) frameAncestors += " http://localhost:3000";

    return [
      {
        source: '/(.*)',
        headers: [
          // 📡 PROTOCOL: Allows Zipha to run inside the Telegram Mini-App shell
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${frameAncestors};`,
          },
          // 🚀 BYPASS: Suppresses Ngrok interstitial for automated Webhook pings
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
          // 🏛️ CACHE CONTROL: Ensures high-fidelity assets are delivered fresh
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // 🧪 EXPERIMENTAL: Signal processing speed enhancements
  experimental: {
    // Optimizing Lucide-React for faster Command Center icon rendering
    optimizePackageImports: ['lucide-react'],
    serverActions: {
      bodySizeLimit: '2mb', // Adjusted for high-density support ticket payloads
    },
  },
};

export default nextConfig;