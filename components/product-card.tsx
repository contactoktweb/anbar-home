'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/mock-products'
import { cn } from '@/lib/utils'
import { ShoppingBag, Heart, Check } from 'lucide-react'
import { useStore } from '@/components/store-provider'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [rating, setRating] = useState(product.rating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const favorite = isFavorite(product.id)

  // Format prices in COP
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  const formattedPrice = product.price > 0 ? formatCOP(product.price) : ''
  const formattedOriginalPrice = product.originalPrice ? formatCOP(product.originalPrice) : null

  return (
    <div className="group flex h-full flex-col cursor-pointer">
      <div className="relative mb-4 aspect-square overflow-hidden bg-white flex items-center justify-center p-4 shrink-0">
        {/* Sale badge */}
        {product.originalPrice && (
          <span className="absolute top-2 left-2 z-10 bg-camel-dark px-2 py-0.5 text-[11px] font-medium uppercase tracking-widest text-white">
            Sale
          </span>
        )}
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
        )}
        
      </div>

      <div className="flex flex-1 flex-col space-y-1">
        {/* Interactive Stars */}
        <div className="flex mb-1" onMouseLeave={() => setHoverRating(0)}>
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1
            const isFilled = starValue <= (hoverRating || rating)
            
            return (
              <svg 
                key={i} 
                className={cn(
                  "w-3.5 h-3.5 cursor-pointer transition-colors duration-150",
                  isFilled ? "text-[#D4AF37] fill-[#D4AF37]" : "text-neutral-300 hover:text-[#D4AF37]"
                )} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth={isFilled ? 0 : 1.5}
                onMouseEnter={() => setHoverRating(starValue)}
                onClick={(e) => {
                  e.preventDefault() // prevent navigating if wrapped in a link later
                  setRating(starValue)
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            )
          })}
        </div>
        
        <h3 className="text-[15px] font-medium leading-snug text-neutral-800 transition-colors group-hover:text-camel line-clamp-2">
          {product.name || '\u00A0'}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-2 min-h-[1.2em]">
            <span className="text-[15px] font-serif text-camel-dark">
              {product.price > 0 ? formattedPrice : '$'}
            </span>
            {formattedOriginalPrice && (
              <span className="text-[13px] font-serif text-neutral-400 line-through">
                {formattedOriginalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 transition-opacity duration-300">
            <button 
              className={cn("transition-colors hover:text-red-500", favorite ? "text-red-500" : "text-neutral-400")}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(product)
              }}
              aria-label="Añadir a favoritos"
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} fill={favorite ? "currentColor" : "none"} />
            </button>
            <button 
              className={cn(
                "transition-colors",
                isAdded ? "text-green-600" : "text-neutral-400 hover:text-camel"
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(product)
                setIsAdded(true)
                setTimeout(() => setIsAdded(false), 2000)
              }}
              aria-label="Añadir al carrito"
            >
              {isAdded ? <Check className="h-4 w-4" strokeWidth={2} /> : <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
