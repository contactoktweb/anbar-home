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
}

export interface CartItem extends Product {
  quantity: number
}
