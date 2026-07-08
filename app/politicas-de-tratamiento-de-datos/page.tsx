import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { client } from '@/sanity/lib/client'

export const metadata: Metadata = {
  title: 'Políticas de tratamiento de datos | Anbar Home',
  description: 'Conoce nuestras políticas de tratamiento de datos personales.',
}

export default async function PoliticasDatosPage() {
  const pageData = await client
    .fetch(`*[_type == "legalPage" && slug.current == "politica-de-tratamiento-de-datos"][0]`)
    .catch(() => null)

  return (
    <LegalLayout title="Políticas de tratamiento de datos" breadcrumb="Políticas de tratamiento de datos">
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
