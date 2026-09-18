import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimizes Sanity CDN image URLs by requesting reduced resolutions,
 * WebP/AVIF auto-formatting, and compression quality to minimize bandwidth and speed up loading.
 */
export function optimizeImageUrl(
  url?: string | null,
  width: number = 1440,
  quality: number = 75
): string {
  if (!url) return ''
  
  // Apply Sanity CDN transformation parameters
  if (url.includes('cdn.sanity.io')) {
    // If URL already has transformation params, return as is
    if (url.includes('w=') && url.includes('auto=format')) {
      return url
    }
    const cleanUrl = url.split('?')[0]
    return `${cleanUrl}?w=${width}&auto=format&q=${quality}`
  }

  return url
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

