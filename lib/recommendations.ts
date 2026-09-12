import { Product } from '@/types'

// Normalized color mappings
const COLOR_KEYWORDS: Record<string, string[]> = {
  negro: ['negro', 'negra', 'black', 'grafito', 'antracita', 'azabache', 'oscuro', 'oscura'],
  blanco: ['blanco', 'blanca', 'white', 'marfil', 'crema', 'arena', 'beige', 'crudo', 'caliza', 'claro', 'clara'],
  dorado: ['dorado', 'dorada', 'gold', 'latón', 'laton', 'bronce', 'amber', 'ámbar', 'ambar'],
  plata: ['plata', 'silver', 'acero', 'gris', 'cromado', 'cromo', 'plomo'],
  tierra: ['terracota', 'tierra', 'café', 'cafe', 'marrón', 'marron', 'nogal', 'roble', 'madera', 'caramelo'],
}

// Normalized material mappings
const MATERIAL_KEYWORDS: Record<string, string[]> = {
  cerámica: ['cerámica', 'ceramica', 'arcilla', 'barro', 'porcelana', 'loza'],
  mármol: ['mármol', 'marmol', 'piedra', 'mineral', 'travertino', 'cemento', 'yeso', 'resina'],
  metal: ['metal', 'metálico', 'metalico', 'acero', 'latón', 'laton', 'hierro', 'bronce', 'aluminio'],
  vidrio: ['vidrio', 'cristal'],
  madera: ['madera', 'roble', 'nogal', 'cedro', 'teca', 'bambú'],
}

// Normalized style and form keywords
const STYLE_KEYWORDS: Record<string, string[]> = {
  escultórico: ['escultura', 'escultórico', 'escultorico', 'busto', 'silueta', 'figura', 'estatua'],
  orgánico: ['orgánico', 'organico', 'curvas', 'fluido', 'ondulado', 'natural'],
  geométrico: ['geométrico', 'geometrico', 'cubo', 'esfera', 'cilindro', 'facetado', 'lineal'],
  clásico: ['clásico', 'clasico', 'griego', 'romano', 'alada', 'victoria', 'aurea', 'bianca', 'mitología', 'mitologia'],
  minimalista: ['minimalista', 'moderno', 'quiet luxury', 'sobrio', 'puro', 'simple', 'elegante'],
}

// Cross-category complementary mapping (Complementar vs Comparar)
const COMPLEMENTARY_CATEGORY_SLUGS: Record<string, string[]> = {
  'esculturas': ['jarrones-escultoricos', 'candelabros', 'acentos-decorativos'],
  'jarrones-escultoricos': ['esculturas', 'candelabros', 'acentos-decorativos'],
  'candelabros': ['jarrones-escultoricos', 'esculturas', 'acentos-decorativos'],
  'acentos-decorativos': ['jarrones-escultoricos', 'esculturas', 'candelabros'],
  'linea-suprema': ['jarrones-escultoricos', 'esculturas', 'candelabros', 'acentos-decorativos'],
  'pesebres-y-nacimientos': ['navidad-en-la-mesa', 'candelabros', 'acentos-decorativos'],
  'navidad-en-la-mesa': ['pesebres-y-nacimientos', 'candelabros', 'acentos-decorativos'],
}

function normalize(text: string = ''): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function extractProductFeatures(product: Product) {
  const content = `${product.name} ${product.category || ''} ${product.description || ''} ${(product.categories || []).join(' ')}`
  const normalized = normalize(content)

  const colors = new Set<string>()
  for (const [colorKey, tokens] of Object.entries(COLOR_KEYWORDS)) {
    if (tokens.some((token) => normalized.includes(normalize(token)))) {
      colors.add(colorKey)
    }
  }

  const materials = new Set<string>()
  for (const [matKey, tokens] of Object.entries(MATERIAL_KEYWORDS)) {
    if (tokens.some((token) => normalized.includes(normalize(token)))) {
      materials.add(matKey)
    }
  }

  const styles = new Set<string>()
  for (const [styleKey, tokens] of Object.entries(STYLE_KEYWORDS)) {
    if (tokens.some((token) => normalized.includes(normalize(token)))) {
      styles.add(styleKey)
    }
  }

  // Significant words from product name (length > 3 and not common prepositions)
  const stopWords = new Set(['para', 'como', 'sobre', 'desde', 'hacia', 'este', 'esta', 'estos', 'estas', 'anbar', 'home', 'decorativo', 'decorativa', 'coleccion', 'linea'])
  const nameTokens = normalize(product.name)
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w))

  return {
    colors,
    materials,
    styles,
    nameTokens,
    normalizedCategory: normalize(product.category || ''),
    categorySlugs: (product.categorySlugs || []).map((s) => normalize(s)),
    allCategories: (product.categories || []).map((c) => normalize(c)),
  }
}

/**
 * 1. "También te pueden gustar" (Comparar)
 * Recommends items within the same category, matching color, style, material, and price range.
 */
export function getSimilarProducts(
  target: Product,
  allProducts: Product[],
  limit = 8
): Product[] {
  if (!target || !allProducts || allProducts.length === 0) return []

  const targetFeatures = extractProductFeatures(target)
  const targetId = target.id || (target as any)._id
  const candidates = allProducts.filter(
    (p) => {
      const pId = p.id || (p as any)._id
      return pId !== targetId && p.slug !== target.slug
    }
  )

  const scored = candidates.map((candidate) => {
    const candidateFeatures = extractProductFeatures(candidate)
    let score = 0

    // 1. Category match (Highest weight for comparison)
    const samePrimaryCategory =
      targetFeatures.normalizedCategory &&
      targetFeatures.normalizedCategory === candidateFeatures.normalizedCategory
    const sharedCategories = targetFeatures.allCategories.some((cat) =>
      candidateFeatures.allCategories.includes(cat)
    )

    if (samePrimaryCategory) {
      score += 70
    } else if (sharedCategories) {
      score += 45
    }

    // 2. Color affinity
    for (const color of targetFeatures.colors) {
      if (candidateFeatures.colors.has(color)) {
        score += 30
      }
    }

    // 3. Material match
    for (const mat of targetFeatures.materials) {
      if (candidateFeatures.materials.has(mat)) {
        score += 20
      }
    }

    // 4. Style & form match
    for (const style of targetFeatures.styles) {
      if (candidateFeatures.styles.has(style)) {
        score += 15
      }
    }

    // 5. Name keywords overlap (e.g. "Victoria", "Alada", "Aurea", etc.)
    for (const token of targetFeatures.nameTokens) {
      if (candidateFeatures.nameTokens.includes(token)) {
        score += 25
      }
    }

    // 6. Price proximity
    if (target.price > 0 && candidate.price > 0) {
      const priceRatio = Math.abs(candidate.price - target.price) / target.price
      if (priceRatio <= 0.35) {
        score += 20
      } else if (priceRatio <= 0.7) {
        score += 10
      }
    }

    return { product: candidate, score }
  })

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)

  // If top scores have tie-breaks or too few, ensure we return top limit
  return scored.slice(0, limit).map((s) => s.product)
}

/**
 * 2. "Combínalo con" (Complementar)
 * Recommends cross-category accents (e.g. Escultura + Jarrón + Candelabro + Bandeja)
 * that harmonize in color palette, material, and proportions.
 */
export function getComplementaryProducts(
  target: Product,
  allProducts: Product[],
  excludeProductIds: Set<string> = new Set(),
  limit = 8
): Product[] {
  if (!target || !allProducts || allProducts.length === 0) return []

  const targetFeatures = extractProductFeatures(target)
  const targetCategorySlugs = targetFeatures.categorySlugs
  const primarySlug = targetCategorySlugs[0] || ''

  // Look up complementary category slugs for the target
  let targetComplementSlugs: string[] = []
  for (const [key, compSlugs] of Object.entries(COMPLEMENTARY_CATEGORY_SLUGS)) {
    if (targetCategorySlugs.includes(key) || targetFeatures.normalizedCategory.includes(key)) {
      targetComplementSlugs = [...targetComplementSlugs, ...compSlugs]
    }
  }

  // Fallback defaults if no direct mapping exists
  if (targetComplementSlugs.length === 0) {
    targetComplementSlugs = ['jarrones-escultoricos', 'candelabros', 'acentos-decorativos', 'esculturas']
  }

  const targetId = target.id || (target as any)._id
  const candidates = allProducts.filter((p) => {
    const pId = p.id || (p as any)._id
    if (pId === targetId || p.slug === target.slug) return false
    if (excludeProductIds.has(pId) || excludeProductIds.has(p.id)) return false
    return true
  })

  const scored = candidates.map((candidate) => {
    const candidateFeatures = extractProductFeatures(candidate)
    let score = 0

    // Must be in a complementary category OR a different primary category
    const isDifferentCategory =
      candidateFeatures.normalizedCategory !== targetFeatures.normalizedCategory
    const matchesComplementarySlugs = candidateFeatures.categorySlugs.some((slug) =>
      targetComplementSlugs.includes(slug)
    )

    if (matchesComplementarySlugs && isDifferentCategory) {
      score += 65
    } else if (isDifferentCategory) {
      score += 25
    } else {
      // Same category gets penalized in "Combínalo con" because comparison belongs to "También te pueden gustar"
      score -= 30
    }

    // 1. Color harmony (e.g., both dark/black or both warm neutral or gold accents)
    for (const color of targetFeatures.colors) {
      if (candidateFeatures.colors.has(color)) {
        score += 35
      }
    }

    // 2. Material harmony
    for (const mat of targetFeatures.materials) {
      if (candidateFeatures.materials.has(mat)) {
        score += 20
      }
    }

    // 3. Style cohesion (e.g. both minimal or both organic)
    for (const style of targetFeatures.styles) {
      if (candidateFeatures.styles.has(style)) {
        score += 15
      }
    }

    // 4. Balanced accessory pricing (ideally complement piece is not astronomical compared to main piece)
    if (target.price > 0 && candidate.price > 0) {
      if (candidate.price <= target.price * 1.5) {
        score += 15
      }
    }

    return { product: candidate, score }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.product)
}

/**
 * Returns both recommendation sets for a product page.
 */
export function getProductRecommendations(
  target: Product,
  allProducts: Product[]
): {
  similarProducts: Product[]
  complementaryProducts: Product[]
} {
  const similarProducts = getSimilarProducts(target, allProducts, 8)
  const excludeIds = new Set<string>(similarProducts.map((p) => p.id))
  excludeIds.add(target.id)

  const complementaryProducts = getComplementaryProducts(
    target,
    allProducts,
    excludeIds,
    8
  )

  return {
    similarProducts,
    complementaryProducts,
  }
}
