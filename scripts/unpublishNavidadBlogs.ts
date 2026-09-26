import { createClient } from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity environment variables in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
})

const NAVIDAD_SLUGS = [
  'decoracion-de-navidad',
  'decoracion-arbol-de-navidad',
  'decoracion-navidad-espacios-pequenos',
  'como-decorar-mesa-navidena',
  'decoracion-navidena-oficinas-hoteles',
]

async function main() {
  console.log('=== DESPUBLICANDO BLOGS DE NAVIDAD (MOVIENDO A BORRADORES) ===\n')

  for (const slug of NAVIDAD_SLUGS) {
    const pubId = `post-${slug}`
    const draftId = `drafts.post-${slug}`

    const doc = await client.getDocument(pubId)
    if (doc) {
      const draftDoc = { ...doc, _id: draftId }
      delete (draftDoc as any)._rev
      await client.createOrReplace(draftDoc)
      await client.delete(pubId)
      console.log(`✓ Despublicado: ${pubId} -> Guardado como borrador (${draftId})`)
    } else {
      console.log(`- ${pubId} ya no está publicado`)
    }
  }

  console.log('\nVerificando estado actual de blogs de Navidad en Sanity...')
  const current = await client.fetch(
    `*[_type == "post" && (slug.current in $slugs || _id in $ids)]{ _id, title, "slug": slug.current }`,
    {
      slugs: NAVIDAD_SLUGS,
      ids: NAVIDAD_SLUGS.flatMap((s) => [`post-${s}`, `drafts.post-${s}`]),
    }
  )

  console.log(current)
  console.log('\n=== PROCESO COMPLETADO EXITOSAMENTE ===')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
