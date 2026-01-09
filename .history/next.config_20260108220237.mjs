/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 🚀 TELEGRAM SDK COMPATIBILITY
     Ensures that the client-side WebApp SDK can be imported 
     without SSR conflicts in Next.js.
  */
  reactStrictMode: true,

  /* 🏁 IMAGES CONFIGURATION
     Allows your dashboard to display user profile photos from Telegram 
     and product images from your merchant services.
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't.me', // For Telegram avatars
      },
      {
        protocol: 'https',
        hostname: 'cdn.telegram.org',
      },
      {
        protocol: 'https',
        hostname: '*.neon.tech', // If hosting assets on Neon/Vercel
      },
    ],
  },

  /* 🔐 SERVERLESS & PRISMA OPTIMIZATION
     Required for Prisma 7 + Next.js 15/16 to handle the binary engine 
     correctly in serverless functions (Neon resilience).
  */
  serverExternalPackages: ['@prisma/client', 'prisma'],

  /* 🛠️ EXPERIMENTAL FEATURES
     'serverComponentsExternalPackages' is used to ensure Prisma 
     doesn't get bundled into the client-side chunks.
  */
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  /* 🛡️ SECURITY HEADERS
     Configures the Content Security Policy (CSP) to allow Telegram's 
     native scripts and prevents 'X-Frame-Options' conflicts inside the bot.
  */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://web.telegram.org https://t.me;",
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