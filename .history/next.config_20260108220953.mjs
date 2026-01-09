/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * 🚀 PRISMA 7 & SERVERLESS OPTIMIZATION
   * These are now top-level keys in Next.js 16.
   * This ensures Prisma binaries are handled correctly in Neon/Vercel.
   */
  serverExternalPackages: ['@prisma/client', 'prisma'],

  /**
   * 🛠️ DEV ORIGINS (Moved to top-level)
   * This fixes the "Cross origin request detected" warning for ngrok.
   */
  allowedDevOrigins: ['*.ngrok-free.app', 'localhost:3000'],

  /**
   * 🏁 IMAGE REMOTE PATTERNS
   * Securely renders Telegram profile photos and merchant asset images.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't.me',
      },
      {
        protocol: 'https',
        hostname: 'cdn.telegram.org',
      },
      {
        protocol: 'https',
        hostname: '*.neon.tech',
      },
    ],
  },

  /**
   * 🛡️ TELEGRAM SECURITY HEADERS
   * Required for the dashboard to load within the Telegram iframe.
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://web.telegram.org https://t.me http://localhost:3000;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://t.me',
          },
        ],
      },
    ];
  },
  /**
   * 🛠️ ALLOW DEV ORIGINS
   * This removes the warning and allows the Mini App to communicate 
   * with your local server via the ngrok tunnel.
   */
  experimental: {
    allowedDevOrigins: ["*.ngrok-free.app", "localhost:3000"],
  },
};

export default nextConfig;