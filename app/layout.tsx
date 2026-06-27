import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { StoreProvider } from '@/components/store-provider'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Anbar Home — Decoración inspirada en Medio Oriente y Egipto',
  description:
    'Anbar Home es una marca de decoración para el hogar inspirada en Medio Oriente y Egipto. Piezas artesanales, atemporales y serenas en tonos camel y blanco.',
  generator: 'v0.app',
  icons: {
    icon: '/logo-A.png',
    apple: '/logo-A.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <StoreProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <Script src="https://checkout.wompi.co/widget.js" strategy="beforeInteractive" />
        </StoreProvider>
      </body>
    </html>
  )
}
