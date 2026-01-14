/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

// 🛰️ DYNAMIC ORIGIN EXTRACTION
// Extracts 'surrounding-herbs-conceptual-colon.trycloudflare.com' from the full URL
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
let APP_HOSTNAME = '';

try {
  APP_HOSTNAME = new URL(APP_URL).hostname;
} catch (e) {
  console.warn("⚠️ [Config]: Invalid NEXT_PUBLIC_APP_URL. Falling back to localhost.");
  APP_HOSTNAME = 'localhost';
}

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
      { protocol: 'https', hostname: APP_HOSTNAME }, // 🚀 Dynamic Hostname
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
            // 🚀 Logic: Dynamic frame-ancestors including current tunnel and local dev
            `frame-ancestors 'self' https://web.telegram.org https://t.me https://desktop.telegram.org ${APP_URL} http://localhost:3000;`,
            "img-src 'self' data: https:;",
            "style-src 'self' 'unsafe-inline';",
            // 🚀 Logic: Added dynamic wss: for Hot Reloading via Cloudflare Tunnels
            `connect-src 'self' https://va.vercel-analytics.com https://${APP_HOSTNAME} wss://${APP_HOSTNAME} wss://localhost:* https://*.trycloudflare.com wss://*.trycloudflare.com;`
          ].join(' ')
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ],
    }];
  },

  // 🏗️ EXPERIMENTAL: Next.js 16 tunnel-safe configuration
  experimental: {
    // 🚀 THE FIX: Dynamically allows your current environment to prevent 404/Blockades
    allowedDevOrigins: [
      APP_HOSTNAME,
      "*.trycloudflare.com",
      "*.ngrok-free.app",
      "localhost:3000"
    ],
    optimizePackageImports: ['lucide-react', 'recharts'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;