import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../sanity/env'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Assuming they have a token or we might need to ask them to provide one if it's required for mutations
})

const lineaSupremaNames = [
  "Jarrón Ámbar Ahumado Redondo",
  "Jarrón Boreal Ahumado Alto",
  "Jarrón Boreal Ahumado Redondo",
  "Jarrón Decorativo Ébano Imperial Bajo",
  "Jarrón Decorativo Ébano Imperial Alto",
  "Jarrón Ámbar Ahumado Alto",
  "Jarrón Geométrico Oliva Alto",
  "Jarrón Geométrico Oliva Redondo",
  "Jarrón Florencia Perla bajo",
  "Jarrón Florencia Perla alto"
]

async function getOrCreateCategory(title: string, slug: string) {
  const existing = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug })
  if (existing) return existing._id

  console.log(`Creating category: ${title}`)
  const newCat = await client.create({
    _type: 'category',
    title: title,
    slug: { _type: 'slug', current: slug }
  })
  return newCat._id
}

async function updateProductsCategory(names: string[], categoryId: string) {
  const products = await client.fetch(`*[_type == "product" && name in $names]`, { names })
  
  if (products.length === 0) {
    console.log(`No products found for this category update.`)
    return
  }

  for (const product of products) {
    console.log(`Updating product: ${product.name}`)
    await client.patch(product._id)
      .set({ category: { _type: 'reference', _ref: categoryId } })
      .commit()
  }
}

async function run() {
  if (!process.env.SANITY_API_TOKEN) {
    console.log("SANITY_API_TOKEN is missing. Please add it to .env.local to perform mutations.")
  }

  try {
    const lineaSupremaId = await getOrCreateCategory('Línea Suprema', 'linea-suprema')
    await updateProductsCategory(lineaSupremaNames, lineaSupremaId)

    console.log("Finished updating categories.")
  } catch (err) {
    console.error("Failed:", err)
  }
}

run()
