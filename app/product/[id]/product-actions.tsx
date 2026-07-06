'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { useStore } from '@/components/store-provider'
import { Heart, Check, Minus, Plus, Loader2 } from 'lucide-react'

export function ProductActions({ product }: { product: Product }) {
  const { cart, addToCart, toggleFavorite, isFavorite } = useStore()
  const router = useRouter()
  const favorite = isFavorite(product.id)
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'added'>('idle')
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (status !== 'idle') return
    
    setStatus('loading')
    
    // Simulate a longer loading state for better UX
    setTimeout(() => {
      addToCart(product, quantity)
      setStatus('added')
      
      // Reset back to idle after a few seconds
      setTimeout(() => {
        setStatus('idle')
        setQuantity(1)
      }, 2500)
    }, 800)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    router.push('/checkout')
  }

  return (
    <div className="mt-2 flex flex-col gap-4">
      
      {/* Selector de cantidad y Primera fila: Comprar Ahora */}
      <div className="flex gap-4 w-full">
        <div className="flex h-[51px] items-center rounded-sm border border-neutral-300 bg-transparent">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 text-neutral-500 transition-colors hover:text-camel"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-sm font-medium text-neutral-900">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 text-neutral-500 transition-colors hover:text-camel"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          className="flex-1 rounded-sm bg-camel-dark px-4 py-4 text-[13px] font-normal uppercase tracking-[0.2em] text-white transition-all hover:bg-neutral-950"
        >
          Comprar Ahora
        </button>
      </div>

      {/* Segunda fila: Al carrito + Favoritos */}
      <div className="flex gap-4 w-full">
        <button
          onClick={handleAddToCart}
          disabled={status !== 'idle'}
          className="flex-1 rounded-sm border border-neutral-950 bg-neutral-950 px-4 py-4 text-[13px] font-normal uppercase tracking-[0.2em] text-white transition-all hover:bg-transparent hover:text-neutral-950 disabled:opacity-90 flex items-center justify-center gap-2 overflow-hidden"
        >
          {status === 'loading' && (
            <span className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} /> Añadiendo...
            </span>
          )}
          {status === 'added' && (
            <span className="flex items-center gap-2 animate-in fade-in zoom-in duration-300 text-green-400">
              <Check className="h-4 w-4 scale-110" strokeWidth={3} /> Añadido
            </span>
          )}
          {status === 'idle' && (
            <span className="animate-in fade-in duration-300">Al Carrito</span>
          )}
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
