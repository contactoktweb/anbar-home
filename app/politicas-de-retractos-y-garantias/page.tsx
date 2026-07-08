import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { client } from '@/sanity/lib/client'

export const metadata: Metadata = {
  title: 'Política integral de retractos, cambios, devoluciones y garantía | Anbar Home',
  description: 'Conoce nuestras políticas de retractos, cambios, devoluciones y garantía.',
}

export default async function PoliticasRetractosGarantiaPage() {
  const pageData = await client
    .fetch(`*[_type == "legalPage" && slug.current == "politicas-de-retractos-y-garantias"][0]`)
    .catch(() => null)

  return (
    <LegalLayout title="Política integral de retractos, cambios, devoluciones y garantía" breadcrumb="Política integral de retractos, cambios, devoluciones y garantía">
      {pageData?.content ? (
        <div className="whitespace-pre-line text-base font-light leading-relaxed text-neutral-700">
          {pageData.content}
        </div>
      ) : (
        <p className="text-neutral-500">Contenido en actualización...</p>
      )}
    </LegalLayout>
  )
}
