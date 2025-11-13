/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Use production backend URL by default, fallback to localhost for local dev
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://smart-study-assistant-1.onrender.com',
  },
}

module.exports = nextConfig

