/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * 🚀 PRISMA 7 & SERVERLESS OPTIMIZATION
   * Moved from experimental to top-level as requested by Next.js.
   * This ensures the Prisma binary is handled correctly in the 
   * Neon/Vercel serverless environment.
   */
  serverExternalPackages: ['@prisma/client', 'prisma'],

  /**
   * 🏁 IMAGE REMOTE PATTERNS
   * Allows the dashboard to securely render Telegram profile 
   * photos and merchant asset images.
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
   * Critical for allowing the dashboard to load within the Telegram 
   * Desktop/Web iframe and preventing cross-origin conflicts.
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
   * 🛠️ DEV ORIGINS
   * Configures allowed origins to prevent the "Cross origin request 
   * detected" warning when using ngrok for mobile testing.
   */
  experimental: {
    allowedDevOrigins: ['*.ngrok-free.app', 'localhost:3000'],
  },
};

export default nextConfig;