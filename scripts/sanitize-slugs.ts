import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { slugify } from '../sanity/lib/slugify'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7zsgx3as'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('Error: SANITY_API_TOKEN is missing from .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

async function sanitizeAllSlugs() {
  console.log('Iniciando saneamiento de slugs en Sanity...')
  console.log(`Proyecto: ${projectId}, Dataset: ${dataset}`)

  const documents = await client.fetch(
    `*[_type in ["product", "category", "post", "author", "legalPage"] && defined(slug.current)]{
      _id,
      _type,
      name,
      title,
      "currentSlug": slug.current
    }`
  )

  console.log(`Total documentos encontrados: ${documents.length}`)

  let updatedCount = 0

  for (const doc of documents) {
    const rawSlug = doc.currentSlug || ''
    const cleanSlug = slugify(rawSlug)

    if (rawSlug !== cleanSlug) {
      console.log(`\n[Modificando] Tipo: ${doc._type} | Nombre/Título: "${doc.name || doc.title}"`)
      console.log(`  ❌ Slug anterior : "${rawSlug}"`)
      console.log(`  ✅ Slug nuevo    : "${cleanSlug}"`)

      try {
        await client
          .patch(doc._id)
          .set({
            slug: {
              _type: 'slug',
              current: cleanSlug,
            },
          })
          .commit()

        updatedCount++
        console.log(`  ✓ Actualizado con éxito (${doc._id})`)
      } catch (err: any) {
        console.error(`  ✕ Error actualizando ${doc._id}:`, err.message)
      }
    }
  }

  console.log(`\n--------------------------------------------`)
  console.log(`Proceso completado. Documentos actualizados: ${updatedCount} de ${documents.length}`)
  console.log(`--------------------------------------------`)
}

sanitizeAllSlugs().catch((err) => {
  console.error('Error durante la ejecución del script:', err)
  process.exit(1)
})
