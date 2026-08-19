'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import { ShoppingBag, Heart, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '@/components/store-provider'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const { cart, addToCart, toggleFavorite, isFavorite } = useStore()
  const favorite = isFavorite(product.id)
  const isInCart = cart.some(item => item.id === product.id)

  // Recopilar todas las imágenes disponibles (principal + galería)
  const allImages = product.image ? [product.image, ...(product.images || [])] : []
  const hasMultipleImages = allImages.length > 1

  // Ciclo automático de imágenes al hacer hover
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isHovered && hasMultipleImages) {
      if (currentImageIndex === 0) {
        setCurrentImageIndex(1)
      }
      
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
      }, 1500) // Cambia de imagen cada 1.5s
    } else {
      setCurrentImageIndex(0) // Reinicia a la imagen principal al quitar el hover
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovered, hasMultipleImages, allImages.length])

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
    <Link 
      href={`/product/${product.slug || product.id}`} 
      className="group flex h-full flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4 aspect-square overflow-hidden bg-white flex items-center justify-center p-4 shrink-0">
        {/* Sale badge */}
        {product.originalPrice && (
          <span className="absolute top-2 left-2 z-10 bg-camel-dark px-2 py-0.5 text-[11px] font-medium uppercase tracking-widest text-white">
            Sale
          </span>
        )}
        
        {/* Render all images stacked, fading between them based on currentImageIndex */}
        {allImages.length > 0 ? (
          allImages.map((img, idx) => (
            <Image
              key={`${img}-${idx}`}
              src={img}
              alt={`${product.name} - Imagen ${idx + 1}`}
              fill
              className={cn(
                "object-cover object-center mix-blend-multiply transition-all duration-700",
                currentImageIndex === idx ? "opacity-100 group-hover:scale-105" : "opacity-0 scale-100"
              )}
            />
          ))
        ) : (
          product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            />
          )
        )}
        
        {/* Dots indicators for hover (optional nice UI touch when hovering) */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {allImages.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  currentImageIndex === idx ? "w-4 bg-camel-dark" : "w-1.5 bg-neutral-300"
                )}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
              }}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-neutral-600 opacity-0 transition-all duration-300 hover:bg-white hover:text-camel group-hover:opacity-100 hidden md:flex"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
              }}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-neutral-600 opacity-0 transition-all duration-300 hover:bg-white hover:text-camel group-hover:opacity-100 hidden md:flex"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-1">
        {/* Read-only Stars */}
        <div className="flex mb-1">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1
            const isFilled = starValue <= Math.round(product.rating || 0)
            
            return (
              <svg 
                key={i} 
                className={cn(
                  "w-3.5 h-3.5 transition-colors duration-150",
                  isFilled ? "text-[#D4AF37] fill-[#D4AF37]" : "text-neutral-200"
                )} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth={isFilled ? 0 : 1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            )
          })}
        </div>
        
        <h3 className="font-sans text-[15px] font-medium leading-snug text-neutral-800 transition-colors group-hover:text-camel line-clamp-2">
          {product.name || '\u00A0'}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-2 min-h-[1.2em]">
            <span className="text-[15px] font-sans font-medium text-neutral-900 tracking-tight">
              {product.price > 0 ? formattedPrice : '$'}
            </span>
            {formattedOriginalPrice && (
              <span className="text-[13px] font-sans text-neutral-400 line-through">
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
              {isAdded ? (
                <Check className="h-4 w-4 animate-pulse scale-125 transition-transform" strokeWidth={2} />
              ) : (
                <ShoppingBag 
                  className="h-4 w-4 transition-transform" 
                  strokeWidth={1.5} 
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
