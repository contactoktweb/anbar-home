import { createClient } from 'next-sanity'
import * as xlsx from 'xlsx'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-27'

if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

async function exportProducts() {
  try {
    const products = await client.fetch(`*[_type == "product"]{
      _id,
      name,
      sku,
      description,
      price,
      originalPrice,
      stock,
      rating,
      ratingCount,
      "categoryTitle": category->title,
      "imageUrl": image.asset->url
    }`)

    const data = products.map((p: any) => ({
      ID: p._id,
      Nombre: p.name,
      SKU: p.sku,
      Categoria: p.categoryTitle || '',
      Precio: p.price,
      Precio_Original: p.originalPrice || '',
      Stock: p.stock || 0,
      Descripcion: p.description || '',
      Imagen: p.imageUrl || '',
      Rating: p.rating || 0,
      Total_Valoraciones: p.ratingCount || 0
    }))

    const worksheet = xlsx.utils.json_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Productos')

    xlsx.writeFile(workbook, 'productos_actuales.xlsx')
    console.log('Exportación exitosa: productos_actuales.xlsx')
  } catch (error) {
    console.error('Error exportando productos:', error)
  }
}

exportProducts()
