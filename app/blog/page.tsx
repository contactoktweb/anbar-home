import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Blog } from '@/components/blog'
import { Concept } from '@/components/concept'

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[72px] md:pt-[84px]">
        <Blog />
        <Concept />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
