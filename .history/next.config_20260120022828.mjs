/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

let APP_HOSTNAME = '';
try {
  APP_HOSTNAME = new URL(APP_URL).hostname;
} catch (e) {
  APP_HOSTNAME = 'localhost';
}

const nextConfig = {
  // ✅ Switch safety based on environment
  reactStrictMode: isProd, 
  
  serverExternalPackages: ['@prisma/client', 'prisma', '@/generated/prisma'],
  
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
      { protocol: 'https', hostname: 'utfs.io' },
      // 🚧 Only allow tunnels in development
      ...(!isProd ? [{ protocol: 'https', hostname: '*.trycloudflare.com' }] : []),
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
            // 🛡️ Prohibit eval in Prod, allow it in Dev for HMR/Fast Refresh
            `script-src 'self' 'unsafe-inline' ${!isProd ? "'unsafe-eval'" : ""} https://telegram.org https://va.vercel-scripts.com;`,
            `frame-ancestors 'self' https://web.telegram.org https://t.me https://desktop.telegram.org ${APP_URL} ${!isProd ? "http://localhost:3000" : ""};`,
            "img-src 'self' data: https:;",
            "style-src 'self' 'unsafe-inline';",
            `connect-src 'self' https://va.vercel-analytics.com https://${APP_HOSTNAME} wss://${APP_HOSTNAME} ${!isProd ? "wss://localhost:* https://*.trycloudflare.com wss://*.trycloudflare.com" : ""};`
          ].join(' ')
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ],
    }];
  },

  experimental: {
    after: true,
    serverActions: {
      bodySizeLimit: '2mb',
      // 🛡️ Hard-lock origins in Prod, allow wildcards in Dev
      allowedOrigins: isProd 
        ? [APP_HOSTNAME] 
        : [APP_HOSTNAME, "*.trycloudflare.com", "*.ngrok-free.app"],
    },
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
};

export default nextConfig;