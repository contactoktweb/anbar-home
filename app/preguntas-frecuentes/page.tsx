import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { FaqAccordion } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Anbar Home',
  description: 'Todo lo que necesitas saber sobre nuestras tiendas, productos y métodos de compra.',
}

import { client } from '@/sanity/lib/client'
import { FAQ_QUERY } from '@/sanity/lib/queries'

export default async function FaqPage() {
  const faqs = await client.fetch(FAQ_QUERY).catch(() => [])

  return (
    <LegalLayout title="Faq's" breadcrumb="Faq's">
      <div className="mb-10 text-left">
        <h2 className="font-serif text-2xl font-medium tracking-wide text-neutral-900 md:text-3xl">
          Todo lo que necesitas saber
        </h2>
      </div>
      <FaqAccordion items={faqs} />
    </LegalLayout>
  )
}
