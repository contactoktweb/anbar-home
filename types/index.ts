export interface Product {
  id: string
  slug?: string
  sku?: string
  name: string
  price: number
  originalPrice?: number
  /** Primary category name (first in the array) */
  category: string
  /** All category names */
  categories?: string[]
  /** All category slugs (for filtering) */
  categorySlugs?: string[]
  image: string
  images?: string[]
  rating: number
  ratingCount?: number
  description?: string
  stock?: number
  isLastUnits?: boolean
  isBestSeller?: boolean
  availability?: string
  dimensions?: string
  material?: string
}

export interface CartItem extends Product {
  quantity: number
}
