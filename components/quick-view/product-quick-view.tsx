'use client'

import { useState, useEffect, useRef, useId } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/store-provider'
import { extractProductSpecs } from '@/lib/product-specs'
import { cn, optimizeImageUrl } from '@/lib/utils'
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Truck,
  Heart,
  Loader2,
} from 'lucide-react'
import { trackEvent } from '@/lib/fb-tracking'

export function ProductQuickView() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    openCart,
    toggleFavorite,
    isFavorite,
  } = useStore()
  const router = useRouter()
  const modalId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const addTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cartTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Mobile swipe handling
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Sincronizar estado cuando se abre con un nuevo producto
  useEffect(() => {
    if (quickViewProduct) {
      previousActiveElement.current = document.activeElement as HTMLElement
      setSelectedImageIndex(0)
      setQuantity(1)
      setIsAdding(false)
      setJustAdded(false)

      // Bloquear scroll del body
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Focus modal
      setTimeout(() => {
        dialogRef.current?.focus()
      }, 50)

      return () => {
        document.body.style.overflow = originalOverflow
        if (addTimerRef.current) clearTimeout(addTimerRef.current)
        if (cartTimerRef.current) clearTimeout(cartTimerRef.current)
        if (previousActiveElement.current) {
          previousActiveElement.current.focus()
        }
      }
    }
  }, [quickViewProduct])

  // Manejar cierre con tecla ESC y Focus Trap
  useEffect(() => {
    if (!quickViewProduct) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeQuickView()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [quickViewProduct, closeQuickView])

  if (!quickViewProduct) return null

  const product = quickViewProduct
  const favorite = isFavorite(product.id)
  const specs = extractProductSpecs(product)

  // Lista completa de imágenes
  const allImages = product.image ? [product.image, ...(product.images || [])] : []
  const hasMultipleImages = allImages.length > 1
  const currentImage = allImages[selectedImageIndex] || product.image

  // Precios
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  const formattedPrice = product.price > 0 ? formatCOP(product.price) : ''
  const formattedOriginalPrice =
    product.originalPrice && product.originalPrice > product.price
      ? formatCOP(product.originalPrice)
      : null

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price)
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  // Stock máximo permitido
  const maxStock =
    typeof product.stock === 'number' && product.stock > 0
      ? product.stock
      : 99

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > maxStock) return maxStock
      return next
    })
  }

  // Touch handlers para swipe en galería mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (hasMultipleImages) {
      if (isLeftSwipe) {
        setSelectedImageIndex((prev) => (prev + 1) % allImages.length)
      } else if (isRightSwipe) {
        setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  // Añadir al carrito
  const handleAddToCart = () => {
    if (!specs.isAvailable || isAdding) return

    setIsAdding(true)

    if (addTimerRef.current) clearTimeout(addTimerRef.current)
    if (cartTimerRef.current) clearTimeout(cartTimerRef.current)

    // Breve feedback visual antes de añadir
    addTimerRef.current = setTimeout(() => {
      addToCart(product, quantity)

      // Meta Pixel Event
      try {
        trackEvent('AddToCart', {
          content_name: product.name,
          content_ids: [product.sku || product.id],
          content_type: 'product',
          value: product.price * quantity,
          currency: 'COP',
          contents: [
            {
              id: product.sku || product.id,
              quantity,
              item_price: product.price,
            },
          ],
        })
      } catch {}

      setIsAdding(false)
      setJustAdded(true)

      // Cerrar la vista previa y desplegar el carrito lateral para mostrar el producto añadido
      cartTimerRef.current = setTimeout(() => {
        setJustAdded(false)
        closeQuickView()
        openCart()
      }, 650)
    }, 350)
  }

  // Navegar a la ficha completa
  const handleNavigateToProduct = () => {
    closeQuickView()
    router.push(`/product/${product.slug || product.id}`)
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeQuickView()
        }
      }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`quickview-title-${modalId}`}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row bg-[#FAFAF8] rounded-2xl shadow-2xl overflow-hidden border border-neutral-200/80 outline-none animate-in zoom-in-95 duration-200"
      >
        {/* Botón cerrar flotante */}
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-neutral-600 shadow-md transition-all hover:bg-neutral-900 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-camel"
          aria-label="Cerrar vista rápida"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* COLUMNA 1: Galería de imágenes */}
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-4 sm:p-6 relative border-b md:border-b-0 md:border-r border-neutral-200/60 shrink-0">
          {/* Badge de descuento */}
          {hasDiscount && discountPercentage > 0 && (
            <span className="absolute top-4 left-4 z-20 bg-camel-dark px-2.5 py-1 text-xs font-semibold tracking-wider text-white rounded-sm shadow-sm">
              -{discountPercentage}%
            </span>
          )}

          {/* Imagen principal con soporte swipe en móvil */}
          <div
            className="relative w-full aspect-square max-h-[380px] md:max-h-[440px] flex items-center justify-center overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentImage ? (
              <Image
                src={optimizeImageUrl(currentImage, 800, 80)}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 450px"
                className="object-contain mix-blend-multiply transition-opacity duration-300 select-none"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-300">
                <ShoppingBag className="h-16 w-16" strokeWidth={1} />
              </div>
            )}

            {/* Flechas de navegación de imagen */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? allImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm text-neutral-700 shadow-md transition-all hover:bg-white hover:text-camel-dark"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev + 1) % allImages.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm text-neutral-700 shadow-md transition-all hover:bg-white hover:text-camel-dark"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails inferiores */}
          {hasMultipleImages && (
            <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto max-w-full px-2 py-1 no-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    'relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 bg-neutral-50 transition-all duration-200',
                    selectedImageIndex === idx
                      ? 'border-camel-dark scale-105 shadow-sm'
                      : 'border-neutral-200/80 hover:border-camel/60 opacity-70 hover:opacity-100'
                  )}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <Image
                    src={optimizeImageUrl(img, 120, 75)}
                    alt={`${product.name} miniatura ${idx + 1}`}
                    fill
                    sizes="56px"
                    className="object-cover mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA 2: Información del Producto & Acciones */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-5 sm:p-7 md:p-8 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            {/* Categoría y Disponibilidad */}
            <div className="flex items-center justify-between gap-3">
              {product.category && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-camel">
                  {product.category}
                </span>
              )}
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium',
                  specs.isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    specs.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                  )}
                />
                {specs.availabilityLabel}
              </span>
            </div>

            {/* Nombre del producto */}
            <h2
              id={`quickview-title-${modalId}`}
              title={product.name}
              className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-neutral-900 leading-tight line-clamp-2"
            >
              {product.name}
            </h2>

            {/* Precios */}
            <div className="flex items-baseline gap-3 pt-1 border-b border-neutral-200/60 pb-3">
              <span className="text-xl sm:text-2xl font-serif font-medium text-neutral-900 tracking-tight">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-sm font-sans text-neutral-400 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* Especificaciones: Medidas y Material */}
            {(specs.dimensions || specs.material) && (
              <div className="rounded-xl border border-neutral-200/80 bg-white/70 p-3.5 space-y-2 text-xs">
                {specs.dimensions && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-neutral-800 min-w-[70px]">
                      Medidas:
                    </span>
                    <span className="text-neutral-600 leading-relaxed">
                      {specs.dimensions}
                    </span>
                  </div>
                )}
                {specs.material && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-neutral-800 min-w-[70px]">
                      Material:
                    </span>
                    <span className="text-neutral-600 leading-relaxed">
                      {specs.material}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bloque Inferior: Selector de cantidad, CTA y Enlace */}
          <div className="mt-6 pt-5 border-t border-neutral-200/60 space-y-3.5">
            {/* Fila 1: Cantidad + Añadir al Carrito + Favorito */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Selector de cantidad */}
              <div className="flex h-12 w-24 sm:w-28 shrink-0 items-center justify-between rounded-lg border border-neutral-300 bg-white px-1 sm:px-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={!specs.isAvailable || quantity <= 1}
                  className="flex h-8 w-7 sm:w-8 items-center justify-center text-neutral-600 transition-colors hover:text-camel-dark disabled:opacity-40 disabled:hover:text-neutral-600"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                </button>
                <span className="text-sm font-medium text-neutral-900 min-w-[18px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={!specs.isAvailable || quantity >= maxStock}
                  className="flex h-8 w-7 sm:w-8 items-center justify-center text-neutral-600 transition-colors hover:text-camel-dark disabled:opacity-40 disabled:hover:text-neutral-600"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                </button>
              </div>

              {/* Botón Añadir al Carrito */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!specs.isAvailable || isAdding}
                className={cn(
                  'flex-1 h-12 px-2.5 sm:px-4 rounded-lg font-medium text-xs sm:text-[13px] uppercase tracking-wide sm:tracking-wider text-white transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm min-w-0 cursor-pointer select-none',
                  specs.isAvailable
                    ? justAdded
                      ? 'bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-neutral-950 hover:bg-camel-dark active:scale-[0.99]'
                    : 'bg-neutral-400 cursor-not-allowed opacity-75'
                )}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    <span>Añadiendo...</span>
                  </>
                ) : justAdded ? (
                  <>
                    <Check className="h-4 w-4 shrink-0 text-white animate-in zoom-in duration-200" strokeWidth={2.5} />
                    <span className="hidden min-[400px]:inline">¡Añadido al carrito!</span>
                    <span className="min-[400px]:hidden">¡Añadido!</span>
                  </>
                ) : specs.isAvailable ? (
                  <>
                    <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span className="hidden min-[400px]:inline">Añadir al carrito</span>
                    <span className="min-[400px]:hidden">Añadir</span>
                  </>
                ) : (
                  <span>Agotado</span>
                )}
              </button>

              {/* Botón Favorito */}
              <button
                type="button"
                onClick={() => toggleFavorite(product)}
                className={cn(
                  'h-12 w-11 sm:w-12 shrink-0 flex items-center justify-center rounded-lg border transition-all hover:bg-neutral-50 active:scale-95 cursor-pointer',
                  favorite
                    ? 'border-red-200 text-red-500 bg-red-50/40'
                    : 'border-neutral-300 text-neutral-600 hover:text-neutral-900'
                )}
                title={favorite ? 'Guardado en favoritos' : 'Guardar en favoritos'}
                aria-label={
                  favorite ? `Eliminar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`
                }
              >
                <Heart
                  className="h-5 w-5 shrink-0 transition-transform"
                  strokeWidth={1.75}
                  fill={favorite ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Fila 2: Ver producto completo */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleNavigateToProduct}
                className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-neutral-600 transition-colors hover:text-camel-dark"
              >
                <span>Ver ficha completa del producto</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" /> Entrega nacional
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
