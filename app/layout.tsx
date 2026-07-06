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
  title: {
    template: '%s | Anbar Home',
    default: 'Anbar Home — Decoración inspirada en Medio Oriente y Egipto',
  },
  description:
    'Anbar Home es una marca de decoración para el hogar inspirada en Medio Oriente y Egipto. Piezas artesanales, atemporales y serenas en tonos camel y blanco.',
  keywords: ['decoración del hogar', 'decoración medio oriente', 'piezas artesanales', 'anbar home', 'jarrones', 'esculturas', 'diseño de interiores colombia', 'lujo silencioso'],
  generator: 'Next.js',
  authors: [{ name: 'Anbar Home' }],
  creator: 'Anbar Home',
  publisher: 'Anbar Home',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://anbarhome.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anbar Home — Decoración Exclusiva',
    description: 'Piezas artesanales, atemporales y serenas inspiradas en Medio Oriente.',
    url: 'https://anbarhome.com',
    siteName: 'Anbar Home',
    images: [
      {
        url: '/logo-A.png',
        width: 800,
        height: 600,
        alt: 'Anbar Home Logo',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anbar Home — Decoración Exclusiva',
    description: 'Piezas artesanales, atemporales y serenas inspiradas en Medio Oriente.',
    images: ['/logo-A.png'],
  },
  icons: {
    icon: '/logo-A.png',
    apple: '/logo-A.png',
  },
  other: {
    'geo.region': 'CO',
    'geo.placename': 'Colombia',
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
      <body className="font-sans antialiased overflow-x-hidden">
        <StoreProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <Script src="https://checkout.wompi.co/widget.js" strategy="beforeInteractive" />
        </StoreProvider>
      </body>
    </html>
  )
}
