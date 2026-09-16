'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { cn, optimizeImageUrl } from '@/lib/utils'
import { extractProductSpecs } from '@/lib/product-specs'
import { ShoppingBag, Heart, Check, Eye } from 'lucide-react'
import { useStore } from '@/components/store-provider'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mobileImageIndex, setMobileImageIndex] = useState<0 | 1>(0)

  const { addToCart, toggleFavorite, isFavorite, openQuickView } = useStore()
  const favorite = isFavorite(product.id)

  // Extraer especificaciones (medidas compactas y material)
  const specs = extractProductSpecs(product)

  // Referencias para discriminar entre tap, swipe horizontal y scroll vertical
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const isHorizontalGesture = useRef<boolean | null>(null)
  const wasSwiping = useRef(false)

  // Identificar primera y segunda imagen de forma estricta y única
  const allImages = product.image ? [product.image, ...(product.images || [])] : []
  const uniqueImages = Array.from(new Set(allImages.filter(Boolean)))
  const primaryImg = uniqueImages[0] || null
  const secondaryImg = uniqueImages.length > 1 ? uniqueImages[1] : null
  const hasSecondImage = Boolean(secondaryImg)

  // Manejo de eventos touch en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPos.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
    isHorizontalGesture.current = null
    wasSwiping.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return
    const currentX = e.targetTouches[0].clientX
    const currentY = e.targetTouches[0].clientY
    const diffX = currentX - touchStartPos.current.x
    const diffY = currentY - touchStartPos.current.y

    // Determinar si el gesto predominante es horizontal o vertical
    if (isHorizontalGesture.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalGesture.current = Math.abs(diffX) > Math.abs(diffY)
      }
    }

    // Si es un swipe horizontal con suficiente desplazamiento, marcar flag para suprimir navegación
    if (isHorizontalGesture.current === true && Math.abs(diffX) > 20) {
      wasSwiping.current = true
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return

    // Si fue un swipe horizontal y existe segunda imagen, alternar entre 0 y 1
    if (isHorizontalGesture.current === true && hasSecondImage) {
      const currentX = e.changedTouches[0].clientX
      const diffX = currentX - touchStartPos.current.x

      if (diffX < -35) {
        // Swipe izquierda -> mostrar segunda imagen
        setMobileImageIndex(1)
      } else if (diffX > 35) {
        // Swipe derecha -> volver a primera imagen
        setMobileImageIndex(0)
      }
    }

    touchStartPos.current = null
    isHorizontalGesture.current = null

    // Restablecer flag tras un breve retardo para prevenir el click subsecuente
    if (wasSwiping.current) {
      setTimeout(() => {
        wasSwiping.current = false
      }, 300)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (wasSwiping.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Formato precios en COP
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\s+/g, '')

  const formattedPrice = product.price > 0 ? formatCOP(product.price) : ''
  const formattedOriginalPrice =
    product.originalPrice && product.originalPrice > product.price
      ? formatCOP(product.originalPrice)
      : null

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price)
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const productUrl = `/product/${product.slug || product.id}`

  return (
    <article
      className="group relative flex h-full flex-col select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enlace de cobertura completa para navegar al tocar o hacer clic en cualquier zona libre */}
      <Link
        href={productUrl}
        onClick={handleOverlayClick}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Contenedor de Imagen con proporciones consistentes */}
      <div
        className="relative mb-3.5 aspect-square overflow-hidden bg-white flex items-center justify-center p-3 sm:p-4 shrink-0 rounded-sm"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Badges: Descuento, Más Vendido o Últimas Unidades */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-start gap-1 pointer-events-none">
          {hasDiscount && discountPercentage > 0 && (
            <span className="bg-camel-dark px-2 py-0.5 text-[11px] font-semibold tracking-wider text-white rounded-sm shadow-sm">
              -{discountPercentage}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-neutral-900/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase text-white rounded-sm shadow-sm flex items-center gap-1 border border-white/10">
              <span className="text-amber-400 text-[10px]">★</span>
              Más Vendido
            </span>
          )}
          {!product.isBestSeller && product.isLastUnits && (
            <span className="bg-amber-700/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase text-white rounded-sm shadow-sm">
              Últimas unidades
            </span>
          )}
        </div>

        {/* Imagen principal */}
        {primaryImg && (
          <Image
            src={optimizeImageUrl(primaryImg, 600, 75)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={75}
            className={cn(
              'object-cover object-center mix-blend-multiply transition-all duration-300 ease-out pointer-events-none',
              hasSecondImage
                ? isHovered
                  ? 'opacity-0 md:opacity-0'
                  : mobileImageIndex === 1
                    ? 'opacity-0 md:opacity-100'
                    : 'opacity-100'
                : isHovered
                  ? 'scale-105'
                  : 'scale-100'
            )}
          />
        )}

        {/* Segunda imagen (Desktop hover y Mobile swipe) */}
        {hasSecondImage && secondaryImg && (
          <Image
            src={optimizeImageUrl(secondaryImg, 600, 75)}
            alt={`${product.name} - Vista secundaria`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={75}
            className={cn(
              'object-cover object-center mix-blend-multiply transition-all duration-300 ease-out pointer-events-none',
              isHovered
                ? 'opacity-100 md:opacity-100 md:scale-105'
                : mobileImageIndex === 1
                  ? 'opacity-100 md:opacity-0'
                  : 'opacity-0 md:opacity-0'
            )}
          />
        )}

        {/* Indicador visual discreto en mobile (2 puntos) */}
        {hasSecondImage && (
          <div
            className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none md:hidden"
            aria-hidden="true"
          >
            <span
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                mobileImageIndex === 0
                  ? 'w-3.5 bg-camel-dark'
                  : 'w-1.5 bg-neutral-300/80'
              )}
            />
            <span
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                mobileImageIndex === 1
                  ? 'w-3.5 bg-camel-dark'
                  : 'w-1.5 bg-neutral-300/80'
              )}
            />
          </div>
        )}

        {/* Botón flotante Vista Rápida en Desktop (Hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            openQuickView(product)
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium tracking-wide text-neutral-900 shadow-md backdrop-blur-sm transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-neutral-900 hover:text-white"
          aria-label={`Vista rápida de ${product.name}`}
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Vista rápida</span>
        </button>
      </div>

      {/* Información del Producto */}
      <div className="flex flex-1 flex-col pt-0.5">
        {/* 1. Nombre del producto */}
        <h3 className="font-sans text-[14.5px] sm:text-[15px] font-medium leading-snug text-neutral-800 transition-colors group-hover:text-camel line-clamp-2">
          <Link
            href={productUrl}
            className="relative z-20 outline-none focus-visible:underline focus-visible:text-camel"
          >
            {product.name || '\u00A0'}
          </Link>
        </h3>

        {/* 2. Precio */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[15px] sm:text-[16px] font-sans font-medium text-neutral-900 tracking-tight">
            {product.price > 0 ? formattedPrice : '$'}
          </span>
          {formattedOriginalPrice && (
            <span className="text-[12.5px] sm:text-[13px] font-sans text-neutral-400 line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* 3. Medidas y Material (Jerarquía secundaria, compacta y discreta) */}
        {(specs.compactDimensions || specs.compactMaterial) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] sm:text-[12px] text-neutral-500 font-light leading-relaxed">
            {specs.compactDimensions && (
              <span className="text-neutral-600 font-normal">
                {specs.compactDimensions}
              </span>
            )}
            {specs.compactDimensions && specs.compactMaterial && (
              <span className="text-neutral-300 select-none">·</span>
            )}
            {specs.compactMaterial && (
              <span className="truncate max-w-full">
                {specs.compactMaterial}
              </span>
            )}
          </div>
        )}

        {/* 4. Barra inferior de acciones secundarias */}
        <div className="flex items-center justify-between mt-auto pt-3">
          {/* Calificación decorativa */}
          {product.rating > 0 ? (
            <div
              className="flex items-center gap-1 pointer-events-none"
              aria-label={`Calificación: ${product.rating} estrellas`}
            >
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1
                const isFilled = starValue <= Math.round(product.rating || 0)
                return (
                  <svg
                    key={i}
                    className={cn(
                      'w-3 h-3',
                      isFilled
                        ? 'text-[#D4AF37] fill-[#D4AF37]'
                        : 'text-neutral-200'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={isFilled ? 0 : 1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                )
              })}
            </div>
          ) : (
            <div />
          )}

          {/* Acciones independientes (z-20 para prevenir navegación de la card) */}
          <div className="relative z-20 flex items-center gap-1 sm:gap-1.5">
            {/* Vista Rápida botón de icono */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-camel-dark hover:bg-neutral-100/80 active:scale-95"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openQuickView(product)
              }}
              title="Vista rápida"
              aria-label={`Vista rápida de ${product.name}`}
            >
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* Favoritos */}
            <button
              type="button"
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/80 active:scale-95',
                favorite ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(product)
              }}
              title={favorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
              aria-label={
                favorite
                  ? `Eliminar ${product.name} de favoritos`
                  : `Añadir ${product.name} a favoritos`
              }
            >
              <Heart
                className="h-4 w-4"
                strokeWidth={1.5}
                fill={favorite ? 'currentColor' : 'none'}
              />
            </button>

            {/* Añadir al Carrito */}
            <button
              type="button"
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/80 active:scale-95',
                isAdded
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-neutral-400 hover:text-camel'
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(product)
                setIsAdded(true)
                setTimeout(() => setIsAdded(false), 2000)
              }}
              title="Añadir al carrito"
              aria-label={`Añadir ${product.name} al carrito`}
            >
              {isAdded ? (
                <Check
                  className="h-4 w-4 text-emerald-600 animate-pulse scale-110"
                  strokeWidth={2.5}
                />
              ) : (
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
