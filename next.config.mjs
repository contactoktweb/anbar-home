/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.io'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Sanity CDN + otras fuentes externas de imagen
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '**.klaviyo.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    // Formatos modernos: el browser recibirá AVIF o WebP automáticamente según soporte
    formats: ['image/avif', 'image/webp'],
    // Tamaños de dispositivo para srcset responsivo
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1440, 1920],
    // Tamaños de imagen para componentes más pequeños (thumbnails, cards)
    imageSizes: [64, 96, 128, 160, 256, 384, 512],
    // Cache mínima de 7 días en las imágenes procesadas
    minimumCacheTTL: 604800,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.io', 'localhost:3000'],
    },
  },
}

export default nextConfig
