/** @type {import('next').NextConfig} */
const nextConfig = {
  // This disables the Vercel/Next.js toolbar in development
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
};

export default nextConfig;