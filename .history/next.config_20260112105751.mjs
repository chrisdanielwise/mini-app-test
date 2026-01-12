/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: false,

  // 🏛️ NODE OPTIMIZATION: Essential for Prisma performance
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // 🛠️ CLOUDFLARE INGRESS: Update allowed origins to your domain
  allowedDevOrigins: isProd ? [] : ['*.pages.dev', '*.workers.dev', 'localhost:3000'],

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
          // 🚀 Added vercel-scripts to script-src to fix the Analytics block in your logs
          value: `default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org https://va.vercel-scripts.com; frame-ancestors https://web.telegram.org https://t.me; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';`
        },
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