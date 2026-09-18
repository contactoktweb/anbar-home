'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { cn, optimizeImageUrl, isChristmasProduct } from '@/lib/utils'
import { extractProductSpecs } from '@/lib/product-specs'
import { ShoppingBag, Heart, Check, Eye } from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { ChristmasRibbon } from '@/components/christmas-ribbon'

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

  // Detectar si el producto corresponde a la colección o temática navideña
  const isChristmas = isChristmasProduct(product)

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

      {/* Contenedor de Imagen con marco elegante y toque festivo */}
      <div
        className="relative mb-3.5 aspect-square overflow-hidden rounded-xl bg-[#FAF9F5] border border-neutral-200/80 flex items-center justify-center p-3 sm:p-4 shrink-0 transition-all duration-500 group-hover:border-[#7A1A28]/40 group-hover:shadow-[0_12px_36px_-10px_rgba(122,26,40,0.15)] group-hover:bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Resplandor sutil navideño en hover (oro y borgoña difuminados) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#7A1A28]/[0.03] via-transparent to-[#D4AF37]/[0.07] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Detalle sutil de destello festivo en la esquina superior derecha */}
        <div className="pointer-events-none absolute top-2.5 right-2.5 z-20 flex items-center justify-center text-amber-500/80 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110">
          <span className="text-[11px] leading-none drop-shadow-xs select-none">✦</span>
        </div>

        {/* Listón Navideño Llamativo en la esquina superior izquierda (sin texto) */}
        {isChristmas && <ChristmasRibbon size="sm" />}

        {/* Badges Adicionales: Descuento, Más Vendido o Últimas Unidades */}
        <div
          className={cn(
            'absolute left-2.5 z-20 flex flex-col items-start gap-1 pointer-events-none transition-all duration-300',
            isChristmas ? 'top-[94px]' : 'top-2.5'
          )}
        >
          {hasDiscount && discountPercentage > 0 && (
            <span className="bg-[#7A1A28] px-2 py-0.5 text-[10.5px] font-semibold tracking-wider text-amber-50 rounded-sm shadow-xs border border-amber-300/20">
              -{discountPercentage}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-neutral-900/95 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-medium tracking-widest uppercase text-amber-100 rounded-sm shadow-xs flex items-center gap-1 border border-amber-300/25">
              <span className="text-amber-400 text-[10px]">★</span>
              Más Vendido
            </span>
          )}
          {!product.isBestSeller && product.isLastUnits && (
            <span className="bg-[#8A3324]/95 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-medium tracking-wider uppercase text-amber-100 rounded-sm shadow-xs border border-amber-200/20">
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

        {/* Indicador visual discreto en mobile (2 puntos con acento festivo) */}
        {hasSecondImage && (
          <div
            className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none md:hidden"
            aria-hidden="true"
          >
            <span
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                mobileImageIndex === 0
                  ? 'w-3.5 bg-[#7A1A28]'
                  : 'w-1.5 bg-neutral-300/80'
              )}
            />
            <span
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                mobileImageIndex === 1
                  ? 'w-3.5 bg-[#7A1A28]'
                  : 'w-1.5 bg-neutral-300/80'
              )}
            />
          </div>
        )}

        {/* Botón flotante Vista Rápida en Desktop (Hover refinado en borgoña y oro) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            openQuickView(product)
          }}
          className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-serif tracking-wider text-neutral-900 shadow-lg border border-amber-200/50 backdrop-blur-md transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#7A1A28] hover:text-white hover:border-[#7A1A28]"
          aria-label={`Vista rápida de ${product.name}`}
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Vista rápida</span>
        </button>
      </div>

      {/* Información del Producto */}
      <div className="flex flex-1 flex-col pt-0.5">
        {/* 1. Nombre del producto en serif elegante */}
        <h3 className="font-serif text-[14.5px] sm:text-[15.5px] font-normal leading-snug text-neutral-900 transition-colors duration-300 group-hover:text-[#7A1A28] line-clamp-2">
          <Link
            href={productUrl}
            className="relative z-20 outline-none focus-visible:underline focus-visible:text-[#7A1A28]"
          >
            {product.name || '\u00A0'}
          </Link>
        </h3>

        {/* 2. Precio con tipografía serena */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-[15px] sm:text-[16.5px] font-serif font-medium text-neutral-900 tracking-tight">
            {product.price > 0 ? formattedPrice : '$'}
          </span>
          {formattedOriginalPrice && (
            <span className="text-[12px] sm:text-[12.5px] font-sans text-neutral-400 line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* 3. Medidas y Material con destello festivo */}
        {(specs.compactDimensions || specs.compactMaterial) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] sm:text-[11.5px] text-neutral-500 font-light leading-relaxed">
            {specs.compactDimensions && (
              <span className="text-neutral-600 font-normal">
                {specs.compactDimensions}
              </span>
            )}
            {specs.compactDimensions && specs.compactMaterial && (
              <span className="text-amber-500/70 select-none text-[9px]">✦</span>
            )}
            {specs.compactMaterial && (
              <span className="truncate max-w-full">
                {specs.compactMaterial}
              </span>
            )}
          </div>
        )}

        {/* 4. Barra inferior de acciones con toques festivos */}
        <div className="flex items-center justify-between mt-auto pt-3">
          {/* Calificación decorativa en oro champán */}
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

          {/* Acciones independientes en borgoña y oro */}
          <div className="relative z-20 flex items-center gap-1 sm:gap-1.5">
            {/* Vista Rápida botón de icono */}
            <button
              type="button"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-[#7A1A28] hover:bg-[#7A1A28]/10 active:scale-95"
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
                'flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-colors active:scale-95',
                favorite
                  ? 'text-[#7A1A28] bg-[#7A1A28]/10'
                  : 'text-neutral-400 hover:text-[#7A1A28] hover:bg-[#7A1A28]/10'
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
                'flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-300 active:scale-95 border',
                isAdded
                  ? 'text-white bg-emerald-700 border-emerald-700 shadow-xs'
                  : 'text-neutral-500 border-neutral-200/80 hover:text-white hover:bg-[#7A1A28] hover:border-[#7A1A28] hover:shadow-xs'
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
                  className="h-4 w-4 text-white animate-pulse scale-110"
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
