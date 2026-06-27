import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const uploadImage = async (filename: string) => {
      const filePath = path.join(process.cwd(), 'public', filename)
      if (!fs.existsSync(filePath)) {
        throw new Error(`El archivo ${filePath} no existe`)
      }
      const stream = fs.createReadStream(filePath)
      const asset = await client.assets.upload('image', stream, {
        filename: filename
      })
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    }

    // Línea Suprema Products
    const products = [
      {
        name: 'Jarrón Decorativo Ébano Imperial Bajo',
        price: 649000,
        category: 'Línea Suprema',
        filename: 'ls-1.webp'
      },
      {
        name: 'Jarrón Boreal Ahumado Redondo',
        price: 599000,
        category: 'Línea Suprema',
        filename: 'ls-2.webp'
      },
      {
        name: 'Jarrón Boreal Ahumado Alto',
        price: 999000,
        category: 'Línea Suprema',
        filename: 'ls-3.webp'
      }
    ]

    for (const p of products) {
      const img = await uploadImage(p.filename)
      await client.create({
        _type: 'product',
        name: p.name,
        price: p.price,
        category: p.category,
        image: img,
        rating: 0
      })
    }

    return NextResponse.json({ success: true, message: 'Productos Línea Suprema subidos correctamente' })
  } catch (err: any) {
    console.error('Error subiendo productos:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
