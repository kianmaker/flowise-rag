/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_FLOWISE_API_URL: process.env.NEXT_PUBLIC_FLOWISE_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_FLOWISE_CHATFLOW_ID: process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID || '',
  },
}

module.exports = nextConfig

