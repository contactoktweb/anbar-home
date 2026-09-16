import { Product } from '@/types'

export interface ProductSpecs {
  dimensions: string | null
  material: string | null
  compactDimensions: string | null
  compactMaterial: string | null
  isAvailable: boolean
  availabilityLabel: string
}

/**
 * Convierte descripciones largas de medidas en un formato compacto y legible
 * adecuado para tarjetas de producto (ej. "37 × 37 × 13 cm" o "25 × 27 cm").
 */
function formatCompactDimensions(raw: string | null): string | null {
  if (!raw) return null
  const clean = raw.replace(/[.]\s*$/, '').trim()

  // Extraer todos los números asociados a unidades cm
  const matches = [...clean.matchAll(/(\d+(?:[.,]\d+)?)\s*cm/gi)]
  if (matches.length >= 2) {
    return matches.map((m) => m[1]).join(' × ') + ' cm'
  }

  // Detectar formatos ya compactos tipo "42 × 22 cm" o "42 x 22 cm"
  const compactMatch = clean.match(
    /^(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)(?:\s*[×x]\s*(\d+(?:[.,]\d+)?))?\s*cm/i
  )
  if (compactMatch) {
    const parts = [compactMatch[1], compactMatch[2], compactMatch[3]].filter(Boolean)
    return parts.join(' × ') + ' cm'
  }

  // Si ya es un texto corto que incluye números y cm (ej. "23 × 24.5 cm")
  if (clean.length <= 25 && /\d/.test(clean)) {
    return clean
  }

  return clean.length > 25 ? clean.slice(0, 25).trim() + '...' : clean
}

/**
 * Limpia el texto de material eliminando redundancias como "de alta calidad"
 * y opcionalmente añade un tono/color breve si está disponible.
 */
function formatCompactMaterial(rawM: string | null, rawC: string | null): string | null {
  if (!rawM) return null
  let m = rawM.replace(/[.]\s*$/, '').trim()

  // Limpiar frases repetitivas de catálogo
  m = m.replace(/\s+de alta (?:calidad|resistencia)/gi, '')
  m = m.replace(/\s+con base en tono.*$/gi, '')
  m = m.trim()

  // Incorporar color/tono si es breve y específico (ej. "Blanco marfil", "Marrón", "Verde y ámbar")
  const c = rawC ? rawC.replace(/[.]\s*$/, '').trim() : null
  if (
    c &&
    c.length <= 18 &&
    !/^disponible/i.test(c) &&
    !c.toLowerCase().includes('consultar')
  ) {
    return `${m} · ${c}`
  }

  return m
}

/**
 * Extrae de forma segura las especificaciones de un producto (medidas, material, disponibilidad),
 * analizando sus campos directos o parseando de forma inteligente la descripción.
 * Si algún dato no existe, retorna null para evitar mostrar bloques vacíos o "undefined".
 */
export function extractProductSpecs(product: Product): ProductSpecs {
  let dimensions: string | null = product.dimensions?.trim() || null
  let material: string | null = product.material?.trim() || null
  let color: string | null = null

  const desc = product.description || ''

  if (desc) {
    if (!dimensions) {
      const dMatch = desc.match(/(?:Medidas|Dimensiones)\s*:\s*([^\n\r]+)/i)
      if (dMatch && dMatch[1]) {
        const clean = dMatch[1].replace(/[.]\s*$/, '').trim()
        if (clean && clean.toLowerCase() !== 'undefined') {
          dimensions = clean
        }
      }
    }

    if (!material) {
      const mMatch = desc.match(/(?:Material|Materiales)\s*:\s*([^\n\r]+)/i)
      if (mMatch && mMatch[1]) {
        const clean = mMatch[1].replace(/[.]\s*$/, '').trim()
        if (clean && clean.toLowerCase() !== 'undefined') {
          material = clean
        }
      }
    }

    const cMatch = desc.match(/(?:Color|Colores)\s*:\s*([^\n\r]+)/i)
    if (cMatch && cMatch[1]) {
      const cleanC = cMatch[1].replace(/[.]\s*$/, '').trim()
      if (cleanC && cleanC.toLowerCase() !== 'undefined') {
        color = cleanC
      }
    }
  }

  // Formatos compactos para cards de producto
  const compactDimensions = formatCompactDimensions(dimensions)
  const compactMaterial = formatCompactMaterial(material, color)

  // Lógica de disponibilidad
  const isOutOfStock =
    product.stock === 0 ||
    product.availability?.toLowerCase() === 'out of stock'

  const isAvailable = !isOutOfStock

  let availabilityLabel = 'Disponible'
  if (isOutOfStock) {
    availabilityLabel = 'Agotado'
  } else if (
    product.isLastUnits === true ||
    (typeof product.stock === 'number' && product.stock > 0 && product.stock <= 5)
  ) {
    availabilityLabel = 'Últimas unidades'
  }

  return {
    dimensions,
    material,
    compactDimensions,
    compactMaterial,
    isAvailable,
    availabilityLabel,
  }
}
