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

    // Colecciones
    const coll1 = await uploadImage('jarrones.webp')
    const coll2 = await uploadImage('esculturas.webp')
    const coll3 = await uploadImage('linea-suprema.webp')

    // Galería
    const gal1 = await uploadImage('Blogs-Anbar-1png.webp')
    const gal2 = await uploadImage('Blogs-Anbar.png.webp')
    const gal3 = await uploadImage('anbar-home-deco.png')
    const gal4 = await uploadImage('Blogs-Anbar-2.png.webp')

    // Se asegura que el documento homePage exista (es un singleton)
    await client.createIfNotExists({
      _id: 'homePage',
      _type: 'homePage',
    })

    // Actualizamos el documento con las imágenes
    await client
      .patch('homePage')
      .setIfMissing({ collectionsList: [], galleryImages: [] })
      .set({
        collectionsList: [
          { _key: 'col-1', title: 'Jarrones Escultóricos', image: coll1 },
          { _key: 'col-2', title: 'Esculturas', image: coll2 },
          { _key: 'col-3', title: 'Línea Suprema', image: coll3 }
        ],
        galleryImages: [
          { ...gal1, _key: 'gal-1', alt: 'Interior sereno con arco y mobiliario en tonos camel' },
          { ...gal2, _key: 'gal-2', alt: 'Escultura de la mujer' },
          { ...gal3, _key: 'gal-3', alt: 'Decoración Anbar' },
          { ...gal4, _key: 'gal-4', alt: 'Salón con arco de yeso, luz natural y decoración cálida' },
        ]
      })
      .commit()

    return NextResponse.json({ success: true, message: 'Imágenes subidas y asignadas correctamente' })
  } catch (err: any) {
    console.error('Error subiendo imágenes:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
