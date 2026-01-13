/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // 🚀 NEXT.JS 16 CORE SETTINGS
  reactStrictMode: false, // Prevents Telegram SDK double-init and token consumption loops
  
  // 🏛️ NODE OPTIMIZATION: Essential for Prisma binary performance in Turbopack
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // 🛰️ CLOUDFLARE & TUNNEL INGRESS (Next.js 16 Standard)
  // Replaces 'trustHost' and 'allowedDevOrigins' to fix startup warnings
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'telegram.org' },
      { protocol: 'https', hostname: 'pulse-alter-series-finally.trycloudflare.com' },
      { protocol: 'https', hostname: '*.trycloudflare.com' },
      { protocol: 'https', hostname: 'utfs.io' },
    ],
  },

  // 🛡️ SECURITY HEADERS: Institutional CSP & Frame Protection
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          // logic: Allows Telegram Mini App iframe embedding + Vercel Analytics ingress
          value: [
            "default-src 'self';",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org https://va.vercel-scripts.com;",
            "frame-ancestors https://web.telegram.org https://t.me http://localhost:3000;",
            "img-src 'self' data: https:;",
            "style-src 'self' 'unsafe-inline';",
            "connect-src 'self' https://va.vercel-analytics.com https://*.trycloudflare.com wss://*.trycloudflare.com;"
          ].join(' ')
        },
        { key: 'X-Frame-Options', value: 'ALLOW-FROM https://web.telegram.org' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ],
    }];
  },

  // 🏗️ EXPERIMENTAL NODE: Next.js 16 compliant keys
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;