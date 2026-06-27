import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Concept } from '@/components/concept'
import { LogoMeaning } from '@/components/logo-meaning'
import { Gallery } from '@/components/gallery'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { client } from '@/sanity/lib/client'
import { HOME_PAGE_QUERY } from '@/sanity/lib/queries'

export default async function Page() {
  const data = await client.fetch(HOME_PAGE_QUERY).catch(() => null)

  return (
    <>
      <SiteHeader />
      <main>
        <Hero data={data} />
        <Concept data={data} />
        <LogoMeaning data={data} />
        <Gallery data={data} />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
