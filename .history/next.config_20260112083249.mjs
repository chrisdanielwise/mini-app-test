/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client', 'prisma'],
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
        { key: 'Content-Security-Policy', value: `frame-ancestors ${frameAncestors} `script-src 'self' 'unsafe-inline' https://telegram.org; frame-ancestors https://web.telegram.org https://t.me;` },
        { key: 'ngrok-skip-browser-warning', value: 'true' },
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