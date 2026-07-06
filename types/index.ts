export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  description?: string
}

export interface CartItem extends Product {
  quantity: number
}
