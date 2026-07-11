export interface Product {
  id: string
  sku?: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  ratingCount?: number
  description?: string
}

export interface CartItem extends Product {
  quantity: number
}
