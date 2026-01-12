/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,

  // 🚀 PRISMA 7 & SERVERLESS OPTIMIZATION
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // 🛠️ DEV ORIGINS (Support for Ngrok Tunnels)
  allowedDevOrigins: isProd ? [] : ['*.ngrok-free.app', 'localhost:3000'],

  // 🏁 IMAGE SECURITY
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.me' },
      { protocol: 'https', hostname: '*.neon.tech' },
    ],
  },

  // 🛡️ SECURITY & NGROK BYPASS
  async headers() {
    let frameAncestors = "https://web.telegram.org https://t.me";
    if (!isProd) frameAncestors += " http://localhost:3000";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${frameAncestors};`,
          },
          // 🚀 BYPASS NGROK BROWSER WARNING (Ensures Bot Connectivity)
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;