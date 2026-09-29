import { createClient } from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity credentials in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
})

async function sync() {
  console.log('--- Sincronizando Categorías con la Administración (Sanity) ---')

  // 1. Obtener todas las categorías actuales
  const existingCats = await client.fetch<any[]>(`*[_type == "category"]{
    _id,
    title,
    "slug": slug.current,
    image,
    isFeatured,
    featuredOrder
  }`)
  console.log(`Encontradas ${existingCats.length} categorías en Sanity.`)

  // Mapa por slug
  const catBySlug = new Map<string, any>()
  for (const c of existingCats) {
    if (c.slug) catBySlug.set(c.slug, c)
  }

  // 2. Crear las categorías que faltan (Esferas Navideñas y Animales) para que existan en el Admin
  let esferasCat = catBySlug.get('esferas-navidenas')
  if (!esferasCat) {
    console.log('Creando categoría "Esferas Navideñas"...')
    esferasCat = await client.create({
      _type: 'category',
      title: 'Esferas Navideñas',
      slug: { _type: 'slug', current: 'esferas-navidenas' },
      description: 'Colección exclusiva de esferas y adornos navideños para ambientar tu árbol y tu hogar.',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-2f6edafb87e20af54235aba1da5bc76417e8d30a-1069x1069-png',
        },
      },
      isFeatured: true,
      featuredOrder: 6,
    })
    console.log(`Categoría "Esferas Navideñas" creada con id: ${esferasCat._id}`)
    catBySlug.set('esferas-navidenas', esferasCat)
  }

  let animalesCat = catBySlug.get('animales')
  if (!animalesCat) {
    console.log('Creando categoría "Animales"...')
    animalesCat = await client.create({
      _type: 'category',
      title: 'Animales',
      slug: { _type: 'slug', current: 'animales' },
      description: 'Figuras decorativas de renos, osos y fauna navideña elaboradas con acabados artesanales.',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-488f35c0bedfbe586b368eccf35327e9b5fc9b7f-1069x1069-png',
        },
      },
      isFeatured: true,
      featuredOrder: 7,
    })
    console.log(`Categoría "Animales" creada con id: ${animalesCat._id}`)
    catBySlug.set('animales', animalesCat)
  }

  // 3. Asignar imagen representativa y estado destacado en cada categoría de temporada
  const featuredSpecs = [
    {
      slug: 'arboles-de-navidad',
      order: 1,
      imageRef: 'image-f8760639c2bf4f4b1869f6e304003e79c91eef44-1069x1069-png',
      displayTitle: 'Árboles de Navidad',
    },
    {
      slug: 'villas-navidenas',
      order: 2,
      imageRef: 'image-d29c841898f558dcde652a34a3a9feeba3ddc76f-1069x1069-png',
      displayTitle: 'Villas Navideñas',
    },
    {
      slug: 'pesebres-y-nacimientos',
      order: 3,
      imageRef: 'image-32081dedd373e715a0211fa6a9453726d5b689fc-1069x1069-png',
      displayTitle: 'Pesebres y Nacimientos',
    },
    {
      slug: 'navidad-en-la-mesa',
      order: 4,
      imageRef: 'image-0c618958e69d5456c030c601d81ecac8ca74a818-1069x1069-png',
      displayTitle: 'Navidad en la Mesa',
    },
    {
      slug: 'navidad-premium',
      order: 5,
      imageRef: 'image-e971c95fdc48d2ef14f1d486a6ede4b399384413-1069x1069-png',
      displayTitle: 'Piezas Grandes Premium',
    },
    {
      slug: 'esferas-navidenas',
      order: 6,
      imageRef: 'image-2f6edafb87e20af54235aba1da5bc76417e8d30a-1069x1069-png',
      displayTitle: 'Esferas Navideñas',
    },
    {
      slug: 'animales',
      order: 7,
      imageRef: 'image-488f35c0bedfbe586b368eccf35327e9b5fc9b7f-1069x1069-png',
      displayTitle: 'Animales',
    },
  ]

  for (const spec of featuredSpecs) {
    const cat = catBySlug.get(spec.slug)
    if (cat) {
      console.log(`Actualizando categoría "${cat.title}" (${spec.slug}) con imagen y destacado...`)
      await client
        .patch(cat._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: spec.imageRef,
            },
          },
          isFeatured: true,
          featuredOrder: spec.order,
        })
        .commit()
    }
  }

  // 4. Actualizar homeCategories en homePage asegurando que TODOS los elementos tengan su categoría vinculada
  console.log('Vinculando homeCategories en la página de inicio (homePage)...')
  const updatedHomeCategories = featuredSpecs.map((spec, index) => {
    const cat = catBySlug.get(spec.slug)
    if (!cat) throw new Error(`Category not found for slug: ${spec.slug}`)

    return {
      _type: 'object',
      _key: `cat-featured-${index + 1}`,
      category: {
        _type: 'reference',
        _ref: cat._id,
      },
      title: spec.displayTitle,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: spec.imageRef,
        },
      },
    }
  })

  await client
    .patch('homePage')
    .set({
      categoriesSectionTitle: 'Categorías Destacadas',
      categoriesSectionSubtitle: 'Colecciones de temporada y piezas navideñas exclusivas',
      homeCategories: updatedHomeCategories,
    })
    .commit()

  console.log('Página de inicio actualizada con las 7 categorías vinculadas a Sanity correctamente.')

  // 5. Vincular productos a "Esferas Navideñas" y "Animales"
  console.log('Vinculando productos a "Esferas Navideñas"...')
  const esferasProds = await client.fetch<any[]>(`*[_type == "product" && (name match "esfera*" || name match "burbuja*" || name match "bola*")]{ _id, categories }`)
  const esferasCatId = catBySlug.get('esferas-navidenas')._id
  for (const p of esferasProds) {
    const currentRefs = (p.categories || []).map((c: any) => c._ref)
    if (!currentRefs.includes(esferasCatId)) {
      await client
        .patch(p._id)
        .setIfMissing({ categories: [] })
        .append('categories', [{ _type: 'reference', _ref: esferasCatId }])
        .commit()
      console.log(`Producto ${p._id} vinculado a Esferas Navideñas`)
    }
  }

  console.log('Vinculando productos a "Animales"...')
  const animalesProds = await client.fetch<any[]>(`*[_type == "product" && (name match "reno*" || name match "oso*" || name match "ciervo*" || name match "animal*")]{ _id, categories }`)
  const animalesCatId = catBySlug.get('animales')._id
  for (const p of animalesProds) {
    const currentRefs = (p.categories || []).map((c: any) => c._ref)
    if (!currentRefs.includes(animalesCatId)) {
      await client
        .patch(p._id)
        .setIfMissing({ categories: [] })
        .append('categories', [{ _type: 'reference', _ref: animalesCatId }])
        .commit()
      console.log(`Producto ${p._id} vinculado a Animales`)
    }
  }

  console.log('--- ¡Sincronización completada con éxito! ---')
}

sync().catch((err) => {
  console.error('Error durante la sincronización:', err)
  process.exit(1)
})
