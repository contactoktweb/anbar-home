import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// El cliente se instancia dentro de la función para asegurar que las variables de entorno estén cargadas
export async function POST(request: Request) {
  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  })

  try {
    const formData = await request.formData()
    
    const productId = formData.get('productId') as string
    const userName = formData.get('userName') as string
    const ratingStr = formData.get('rating') as string
    const comment = formData.get('comment') as string
    const imageFile = formData.get('image') as File | null

    if (!productId || !userName || !ratingStr || !comment) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const rating = parseInt(ratingStr, 10)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Calificación inválida' }, { status: 400 })
    }

    let imageAsset = null

    // Subir imagen a Sanity si existe
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: imageFile.name,
        contentType: imageFile.type,
      })
      
      imageAsset = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      }
    }

    // Crear el documento de reseña
    const reviewDoc = {
      _type: 'review',
      product: {
        _type: 'reference',
        _ref: productId,
      },
      userName,
      rating,
      comment,
      ...(imageAsset && { image: imageAsset }),
      status: 'approved', // Publicación automática por defecto (como sugerido en el plan)
    }

    await writeClient.create(reviewDoc)

    // Recalcular promedio de estrellas
    const reviews = await writeClient.fetch(
      `*[_type == "review" && product._ref == $productId && status == 'approved']{ rating }`,
      { productId }
    )

    const ratingCount = reviews.length
    const totalStars = reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0)
    const newAverage = ratingCount > 0 ? Number((totalStars / ratingCount).toFixed(1)) : 0

    // Actualizar el producto con el nuevo rating
    await writeClient
      .patch(productId)
      .set({ rating: newAverage, ratingCount: ratingCount })
      .commit()

    return NextResponse.json({ success: true, message: 'Reseña enviada con éxito', newAverage, ratingCount })

  } catch (error) {
    console.error('Error al enviar la reseña:', error)
    return NextResponse.json({ error: 'Error interno del servidor al procesar la reseña' }, { status: 500 })
  }
}
