/** @type {import('next').NextConfig} */
const nextConfig = {
  // FIXED: This disables the toolbar blocking your navigation
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig