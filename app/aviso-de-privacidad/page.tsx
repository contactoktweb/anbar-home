import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { client } from '@/sanity/lib/client'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | Anbar Home',
  description: 'Conoce nuestro aviso de privacidad y las políticas de tratamiento de datos personales de ANBAR S.A.S.',
}

export default async function AvisoPrivacidadPage() {
  const pageData = await client
    .fetch(`*[_type == "legalPage" && slug.current == "aviso-de-privacidad"][0]`)
    .catch(() => null)

  return (
    <LegalLayout title="Aviso de privacidad" breadcrumb="Aviso de privacidad">
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

