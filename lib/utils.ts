import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimiza URLs de imágenes del CDN de Sanity aplicando transformaciones en la URL:
 * - fm=webp  → Fuerza formato WebP (máxima compresión sin pérdida visual perceptible)
 * - w        → Limita el ancho máximo al tamaño renderizado (evita descargar originales enormes)
 * - q        → Calidad de compresión (75–85 es el rango ideal para web)
 * - fit=max  → No amplía imágenes pequeñas (evita upscaling que aumenta tamaño sin beneficio)
 *
 * Si `next/image` está activo (unoptimized: false), esta función se vuelve una capa
 * de seguridad extra para URLs pasadas como prop o usadas fuera de componentes <Image>.
 */
export function optimizeImageUrl(
  url?: string | null,
  width: number = 1440,
  quality: number = 75
): string {
  if (!url) return ''

  if (url.includes('cdn.sanity.io')) {
    try {
      const parsed = new URL(url)
      parsed.searchParams.set('w', width.toString())
      parsed.searchParams.set('fm', 'webp')
      parsed.searchParams.set('q', quality.toString())
      if (!parsed.searchParams.has('fit')) {
        parsed.searchParams.set('fit', 'max')
      }
      return parsed.toString()
    } catch {
      const cleanUrl = url.split('?')[0]
      return `${cleanUrl}?w=${width}&fm=webp&q=${quality}&fit=max`
    }
  }

  return url
}

/**
 * Genera una URL de imagen Sanity ultra-reducida para usar como blurDataURL en <Image>.
 * 20px de ancho es suficiente para el efecto de placeholder borroso.
 */
export function sanityBlurUrl(url?: string | null): string {
  if (!url || !url.includes('cdn.sanity.io')) return ''
  const cleanUrl = url.split('?')[0]
  return `${cleanUrl}?w=20&fm=webp&q=20&fit=max&blur=50`
}


/**
 * Detecta si un producto pertenece a las colecciones o temática navideña
 */
export function isChristmasProduct(product?: {
  name?: string
  category?: string
  categorySlugs?: string[]
  categories?: string[]
} | null): boolean {
  if (!product) return false

  const christmasSlugs = [
    'arboles-de-navidad',
    'villas-navidenas',
    'navidad-premium',
    'navidad-en-la-mesa',
    'pesebres-y-nacimientos',
    'navidad',
  ]

  const hasMatchingSlug = (product.categorySlugs || []).some((slug) =>
    christmasSlugs.includes(slug)
  )
  if (hasMatchingSlug) return true

  const textToCheck = [
    product.category || '',
    product.name || '',
    ...(product.categories || []),
  ]
    .join(' ')
    .toLowerCase()

  return (
    textToCheck.includes('navid') ||
    textToCheck.includes('pesebre') ||
    textToCheck.includes('árbol') ||
    textToCheck.includes('arbol') ||
    textToCheck.includes('villa') ||
    textToCheck.includes('nacimiento') ||
    textToCheck.includes('guirnalda') ||
    textToCheck.includes('corona navideña') ||
    textToCheck.includes('corona navid')
  )
}

