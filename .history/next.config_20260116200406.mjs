/** @type {import('next').NextConfig} */

// 🛰️ DYNAMIC ORIGIN EXTRACTION
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
let APP_HOSTNAME = '';

try {
  APP_HOSTNAME = new URL(APP_URL).hostname;
} catch (e) {
  APP_HOSTNAME = 'localhost';
}

const nextConfig = {
  // 🚀 CORE SETTINGS
  reactStrictMode: false, 
  
  // 🏛️ PRISMA & SERVER OPTIMIZATION
  serverExternalPackages: ['@prisma/client', 'prisma'],
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
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

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'telegram.org' },
      { protocol: 'https', hostname: APP_HOSTNAME },
      { protocol: 'https', hostname: '*.trycloudflare.com' },
      { protocol: 'https', hostname: 'utfs.io' },
    ],
  },

  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self';",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org https://va.vercel-scripts.com;",
            `frame-ancestors 'self' https://web.telegram.org https://t.me https://desktop.telegram.org ${APP_URL} http://localhost:3000;`,
            "img-src 'self' data: https:;",
            "style-src 'self' 'unsafe-inline';",
            `connect-src 'self' https://va.vercel-analytics.com https://${APP_HOSTNAME} wss://${APP_HOSTNAME} wss://localhost:* https://*.trycloudflare.com wss://*.trycloudflare.com;`
          ].join(' ')
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ],
    }];
  },

  // 🏗️ EXPERIMENTAL & SECURITY BLOCK
  experimental: {
    after: true,
    // 🚀 THE FIX for "Cross origin request detected"
    // Next.js 15+ requires explicit origins for Server Actions over tunnels
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [
        "hold-logged-undergraduate-reach.trycloudflare.com", // Your specific tunnel
        "*.trycloudflare.com",
        "*.ngrok-free.app",
        APP_HOSTNAME
      ],
    },
    // 🚀 THE FIX for "allowedDevOrigins"
    // This resolves the HMR / WebSocket warnings over the tunnel
    allowedDevOrigins: [
        "hold-logged-undergraduate-reach.trycloudflare.com",
        "*.trycloudflare.com"
    ],
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;