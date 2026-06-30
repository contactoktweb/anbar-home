'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/mock-products'
import { useStore } from '@/components/store-provider'
import { Heart } from 'lucide-react'

export function ProductActions({ product }: { product: Product }) {
  const { cart, addToCart, toggleFavorite, isFavorite } = useStore()
  const router = useRouter()
  const favorite = isFavorite(product.id)
  const isInCart = cart.some(item => item.id === product.id)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)
    
    // Simulate a brief loading state for feedback
    setTimeout(() => {
      setIsAdding(false)
    }, 600)
  }

  const handleBuyNow = () => {
    addToCart(product)
    router.push('/checkout')
  }

  return (
    <div className="mt-10 flex gap-3">
      <button
        onClick={handleBuyNow}
        className="flex-[3] rounded-sm bg-camel-dark px-2 py-4 text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white transition-all hover:bg-neutral-900"
      >
        Comprar
      </button>

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-[3] rounded-sm border border-neutral-900 bg-neutral-900 px-2 py-4 text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white transition-all hover:bg-transparent hover:text-neutral-900 disabled:opacity-70"
      >
        {isAdding ? 'Añadido' : 'Al Carrito'}
      </button>

      <button
        onClick={() => toggleFavorite(product)}
        className="flex flex-[1] max-w-[60px] items-center justify-center rounded-sm border border-neutral-200 bg-transparent transition-all hover:border-neutral-300 hover:bg-neutral-50"
        aria-label="Añadir a favoritos"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            favorite ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-500'
          }`}
        />
      </button>
    </div>
  )
}
