import Script from 'next/script'
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from '@/lib/gtag'

export function GoogleAnalytics() {
  return (
    <>
      {/* Google tag (gtag.js) - Google Ads & Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  )
}
