import fs from 'fs'
import path from 'path'
import csvParser from 'csv-parser'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Faltan variables de entorno para conectarse a Sanity.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-01-01',
})

const csvFilePath = path.resolve(__dirname, '../public/products.csv')

interface CsvRow {
  ID: string
  Tipo: string
  SKU: string
  Nombre: string
  Descripción: string
  'Descripción corta': string
  Inventario: string
  'Precio normal': string
  'Precio rebajado': string
  Categorías: string
  Imágenes: string
}

async function uploadImageFromUrl(url: string, filename: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image ${url}: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const asset = await client.assets.upload('image', buffer, { filename })
    return asset._id
  } catch (error) {
    console.error(`Error uploading image from ${url}:`, error)
    return null
  }
}

function parsePrice(priceStr: string) {
  if (!priceStr) return undefined
  const cleaned = priceStr.replace(/[^0-9.]/g, '')
  return cleaned ? parseFloat(cleaned) : undefined
}

async function importProducts() {
  const products: CsvRow[] = []

  // Read CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => products.push(data))
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`Encontrados ${products.length} productos en el CSV.`)

  for (const row of products) {
    // Only import simple/variable products, avoiding empty rows if any
    if (!row.Nombre || !row.SKU) continue

    console.log(`Procesando: ${row.Nombre} (SKU: ${row.SKU})`)

    const imageUrls = row.Imágenes
      ? row.Imágenes.split(',').map((url) => url.trim()).filter((url) => url)
      : []

    let mainImageId = null
    const galleryImageIds: string[] = []

    // Upload images
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i]
      const filename = url.split('/').pop() || `image-${row.SKU}-${i}.jpg`
      const assetId = await uploadImageFromUrl(url, filename)

      if (assetId) {
        if (i === 0) {
          mainImageId = assetId
        } else {
          galleryImageIds.push(assetId)
        }
      }
    }

    // Build the gallery array
    const gallery = galleryImageIds.map((id, index) => ({
      _key: `gallery-${row.SKU}-${index}`,
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: id,
      },
    }))

    // Build product document
    const productDoc = {
      _type: 'product',
      name: row.Nombre,
      sku: row.SKU,
      description: row.Descripción || row['Descripción corta'] || '',
      price: parsePrice(row['Precio rebajado']) || parsePrice(row['Precio normal']) || 0,
      originalPrice: parsePrice(row['Precio rebajado']) ? parsePrice(row['Precio normal']) : undefined,
      stock: parseInt(row.Inventario || '0', 10) || 0,
      category: row.Categorías ? row.Categorías.split(',')[0].trim() : 'Sin Categoría',
      image: mainImageId
        ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: mainImageId,
            },
          }
        : undefined,
      gallery: gallery.length > 0 ? gallery : undefined,
    }

    try {
      const createdProduct = await client.create(productDoc)
      console.log(`✅ Producto creado: ${createdProduct.name} (${createdProduct._id})`)
    } catch (error) {
      console.error(`❌ Error creando el producto ${row.Nombre}:`, error)
    }
  }

  console.log('🎉 Importación finalizada.')
}

importProducts().catch((err) => {
  console.error('Error durante la importación:', err)
})
