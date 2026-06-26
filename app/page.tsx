import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Concept } from '@/components/concept'
import { LogoMeaning } from '@/components/logo-meaning'
import { Gallery } from '@/components/gallery'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Concept />
        <LogoMeaning />
        <Gallery />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
