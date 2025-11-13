/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Use production backend URL by default, fallback to localhost for local dev
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://smart-study-assistant-1.onrender.com',
  },
  // Ensure proper production builds
  productionBrowserSourceMaps: false,
  // Optimize for deployment
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig

