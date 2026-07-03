import { SiteHeader } from '@/components/site-header'
import { HeroWow } from '@/components/hero-wow'
import { FeaturedProducts } from '@/components/featured-products'
import { NewArrivals } from '@/components/new-arrivals'
import { LogoMeaning } from '@/components/logo-meaning'
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
        <HeroWow />
        <FeaturedProducts />
        <NewArrivals />
        <LogoMeaning data={data} />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
