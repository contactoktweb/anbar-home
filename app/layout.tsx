import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Poppins } from 'next/font/google'
import { StoreProvider } from '@/components/store-provider'
import { DiscountModal } from '@/components/discount-modal'
import { KlaviyoScript } from '@/components/klaviyo-script'
import { KlaviyoRouteTracker } from '@/components/klaviyo-route-tracker'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Anbar Home',
    default: 'Anbar Home — Decoración Exclusiva',
  },
  description:
    'Anbar Home es una marca de decoración para el hogar. Piezas artesanales, atemporales y serenas en tonos camel y blanco.',
  keywords: ['decoración del hogar', 'decoración', 'piezas artesanales', 'anbar home', 'jarrones', 'esculturas', 'diseño de interiores colombia', 'lujo silencioso'],
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
    description: 'Piezas artesanales, atemporales y serenas.',
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
    description: 'Piezas artesanales, atemporales y serenas.',
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
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable} bg-background`}
    >
      <body className="font-sans antialiased overflow-x-hidden">
        <StoreProvider>
          <KlaviyoScript />
          <KlaviyoRouteTracker />
          {children}
          <DiscountModal />
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <Script src="https://checkout.wompi.co/widget.js" strategy="beforeInteractive" />

          {/* Meta Pixel Code */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID || '1068742772254099'}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID || '1068742772254099'}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
          {/* End Meta Pixel Code */}

          {/* Microsoft Clarity */}
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xoiz50lzx8");
            `}
          </Script>
        </StoreProvider>
      </body>
    </html>
  )
}
