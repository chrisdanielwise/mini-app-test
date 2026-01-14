/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // 🚀 NEXT.JS 16 CORE SETTINGS
  reactStrictMode: false, // Prevents Telegram SDK double-init and token consumption loops
  
  // 🏛️ NODE OPTIMIZATION: Essential for Prisma binary performance
  serverExternalPackages: ['@prisma/client', 'prisma'],
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 🛡️ Prevent bundling of Node-specific modules in the client (Fixes 'tls' error)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        tls: false,
        net: false,
        fs: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },

  // 🛰️ CLOUDFLARE & TUNNEL INGRESS
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'telegram.org' },
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
          value: [
            "default-src 'self';",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org https://va.vercel-scripts.com;",
            // 🚀 Logic: Essential for Telegram Mini App embedding and Local testing
            "frame-ancestors 'self' https://web.telegram.org https://t.me https://desktop.telegram.org http://localhost:3000;",
            "img-src 'self' data: https:;",
            "style-src 'self' 'unsafe-inline';",
            // 🚀 Logic: Added wss: for Hot Reloading via Cloudflare Tunnels
            "connect-src 'self' https://va.vercel-analytics.com https://*.trycloudflare.com wss://*.trycloudflare.com wss://localhost:*;"
          ].join(' ')
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ],
    }];
  },

  // 🏗️ EXPERIMENTAL: Next.js 16 tunnel-safe configuration
  experimental: {
    // 🚀 THE FIX: Resolves the "Cross origin request detected" warning and 404s
    allowedDevOrigins: [
      "surrounding-herbs-conceptual-colon.trycloudflare.com", // Your specific tunnel
      "female-def-quizzes-floor.trycloudflare.com", 
      "*.trycloudflare.com",
      "*.ngrok-free.app"
    ],
    optimizePackageImports: ['lucide-react', 'recharts'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;