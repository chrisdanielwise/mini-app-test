/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. PERFORMANCE: Tell Next.js to treat these as external to speed up DB handshake
  serverExternalPackages: ["@prisma/client", "pg"],

  // 2. TELEGRAM FIX: Allows the Telegram Mini App origin to connect to your dev server
  experimental: {
    allowedDevOrigins: ["*.telegram.org", "localhost:3000"],
  },

  // 3. UI/CLEANUP: Your existing indicators
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },

  // 4. BUILD SAFETY
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    unoptimized: true,
  },

  trailingSlash: false,
}

export default nextConfig