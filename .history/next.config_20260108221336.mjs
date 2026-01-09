/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,

  /**
   * 🚀 PRISMA 7 & SERVERLESS OPTIMIZATION
   * Top-level keys for Prisma 7 compatibility in Next.js 16.
   * Ensures database handshakes are stable in Neon/Vercel.
   */
  serverExternalPackages: ['@prisma/client', 'prisma'],

  /**
   * 🛠️ DEV ORIGINS
   * Configured dynamically to support ngrok during development.
   * This removes the "Cross origin request detected" warning.
   */
  allowedDevOrigins: isProd ? [] : ['*.ngrok-free.app', 'localhost:3000'],

  /**
   * 🏁 IMAGE REMOTE PATTERNS
   * Allows secure rendering of Telegram avatars and merchant assets.
   */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: 'cdn.telegram.org' },
      { protocol: 'https', hostname: '*.neon.tech' },
    ],
  },

  /**
   * 🛡️ TELEGRAM SECURITY HEADERS
   * Critical for allowing your app to load in the Telegram Iframe.
   */
  async headers() {
    // Set up standard Telegram frame ancestors
    let frameAncestors = "https://web.telegram.org https://t.me";
    
    // Add localhost only when not in production for extra security
    if (!isProd) {
      frameAncestors += " http://localhost:3000";
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${frameAncestors};`,
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://t.me',
          },
        ],
      },
    ];
  },
};

export default nextConfig;