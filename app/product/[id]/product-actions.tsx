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
    <div className="mt-10 flex flex-col gap-4">
      {/* Primera fila: Comprar Ahora */}
      <button
        onClick={handleBuyNow}
        className="w-full rounded-sm bg-camel-dark px-4 py-4 text-[13px] font-normal uppercase tracking-[0.2em] text-white transition-all hover:bg-neutral-950"
      >
        Comprar Ahora
      </button>

      {/* Segunda fila: Al carrito + Favoritos */}
      <div className="flex gap-4 w-full">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 rounded-sm border border-neutral-950 bg-neutral-950 px-4 py-4 text-[13px] font-normal uppercase tracking-[0.2em] text-white transition-all hover:bg-transparent hover:text-neutral-950 disabled:opacity-70"
        >
          {isAdding ? 'Añadido' : 'Al Carrito'}
        </button>

        <button
          onClick={() => toggleFavorite(product)}
          className="w-[64px] flex-shrink-0 flex items-center justify-center rounded-sm border border-neutral-200 bg-transparent transition-all hover:border-neutral-300 hover:bg-neutral-50"
          aria-label="Añadir a favoritos"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              favorite ? 'fill-neutral-950 text-neutral-950' : 'text-neutral-400'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
