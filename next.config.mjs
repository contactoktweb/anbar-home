/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.io'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [75, 80, 90],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.io', 'localhost:3000'],
    },
  },
}

export default nextConfig
