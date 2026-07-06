import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
})

// Función simple para crear slug a partir del título
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normaliza acentos
    .replace(/[\u0300-\u036f]/g, '') // Remueve acentos
    .replace(/[^a-z0-9 -]/g, '') // Remueve caracteres no alfanuméricos
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-') // Elimina guiones repetidos
}

// Función para limpiar HTML de la descripción
function cleanHtml(htmlStr: string) {
  if (!htmlStr) return ''
  return htmlStr
    .replace(/<\/p>/g, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>?/gm, '')
    .trim()
}

async function updateProducts() {
  console.log('Obteniendo productos de Sanity...')
  // Traemos los productos. 
  // Nota: si el campo 'category' sigue siendo un string, lo leeremos como string.
  // Si ya es un objeto (referencia), lo ignoraremos para no re-procesarlo.
  const products = await client.fetch(`*[_type == "product"]{_id, _rev, description, category}`)
  console.log(`Se encontraron ${products.length} productos.`)

  // 1. Recopilar categorías únicas
  const categoryNames = new Set<string>()
  for (const p of products) {
    if (typeof p.category === 'string') {
      const parts = p.category.split(',').map((c: string) => c.trim()).filter(Boolean)
      if (parts.length > 0) {
        // Tomaremos la primera categoría o la parte después de ">"
        const mainCat = parts[0].includes('>') ? parts[0].split('>').pop()?.trim() : parts[0]
        if (mainCat) categoryNames.add(mainCat)
      }
    }
  }

  // 2. Crear categorías en Sanity si no existen y mapear por nombre
  const categoryMap = new Map<string, string>() // name -> _id
  console.log(`Creando/Buscando ${categoryNames.size} categorías...`)

  for (const catName of categoryNames) {
    const existingCat = await client.fetch(`*[_type == "category" && title == $title][0]`, { title: catName })
    if (existingCat) {
      categoryMap.set(catName, existingCat._id)
    } else {
      const newCat = await client.create({
        _type: 'category',
        title: catName,
        slug: { current: slugify(catName) }
      })
      categoryMap.set(catName, newCat._id)
      console.log(`Categoría creada: ${catName} (${newCat._id})`)
    }
  }

  // 3. Actualizar productos
  console.log('Actualizando descripciones y referencias a categorías en los productos...')
  for (const p of products) {
    let needsUpdate = false
    const patch = client.patch(p._id)

    // A) Limpiar HTML de la descripción
    if (p.description && /<[a-z][\s\S]*>/i.test(p.description)) {
      const plainText = cleanHtml(p.description)
      patch.set({ description: plainText })
      needsUpdate = true
    } else if (p.description) {
        // Por si quedan \n escapados o cosas raras, también podemos aplicar la limpieza, 
        // pero solo si estamos seguros. Si no tiene HTML, lo dejamos.
    }

    // B) Actualizar la categoría para que sea una referencia
    if (typeof p.category === 'string') {
      const parts = p.category.split(',').map((c: string) => c.trim()).filter(Boolean)
      const mainCat = parts.length > 0 ? (parts[0].includes('>') ? parts[0].split('>').pop()?.trim() : parts[0]) : null
      
      if (mainCat && categoryMap.has(mainCat)) {
        patch.set({
          category: {
            _type: 'reference',
            _ref: categoryMap.get(mainCat)
          }
        })
        needsUpdate = true
      }
    }

    if (needsUpdate) {
      try {
        await patch.commit()
        console.log(`✅ Producto actualizado: ${p._id}`)
      } catch (err) {
        console.error(`❌ Error actualizando ${p._id}:`, err)
      }
    }
  }

  console.log('🎉 Actualización finalizada.')
}

updateProducts().catch(err => {
  console.error('Error en la actualización:', err)
})
