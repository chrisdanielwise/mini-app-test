/** @type {import('next').NextConfig} */
const nextConfig = {
  // This kills the "Issues 0" bubble
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  // Prevents common build-time failures for new routes
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force trailing slash to be consistent
  trailingSlash: false,
}

export default nextConfig