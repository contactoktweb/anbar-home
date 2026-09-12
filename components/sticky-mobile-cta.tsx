'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { useStore } from '@/components/store-provider'
import { Heart, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/fb-tracking'

interface StickyMobileCtaProps {
  product: Product
  targetAnchorId?: string
}

export function StickyMobileCta({
  product,
  targetAnchorId = 'product-main-cta-anchor',
}: StickyMobileCtaProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'added'>('idle')
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const favorite = isFavorite(product.id)

  useEffect(() => {
    const target = document.getElementById(targetAnchorId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar only when the original CTA has scrolled above the viewport
        const isPastCta = !entry.isIntersecting && entry.boundingClientRect.top < 0
        setIsVisible(isPastCta)
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetAnchorId])

  const handleAddToCart = () => {
    if (status !== 'idle') return
    setStatus('loading')

    setTimeout(() => {
      addToCart(product, 1)

      trackEvent('AddToCart', {
        content_name: product.name,
        content_ids: [product.sku || product.id],
        content_type: 'product',
        value: product.price,
        currency: 'COP',
        contents: [
          {
            id: product.sku || product.id,
            quantity: 1,
            item_price: product.price,
          },
        ],
      })

      setStatus('added')

      setTimeout(() => {
        setStatus('idle')
      }, 2500)
    }, 600)
  }

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price)

  return (
    <div
      aria-hidden={!isVisible}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-3.5 py-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] transition-transform duration-300 ease-out will-change-transform',
        isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      )}
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Left: Heart Favorite + Price */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer',
              favorite
                ? 'border-red-200 text-red-500 bg-red-50/50'
                : 'border-neutral-200 text-neutral-600 bg-neutral-50 hover:bg-neutral-100'
            )}
            aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Heart
              className={cn('h-4 w-4 transition-transform', favorite ? 'fill-red-500 scale-110' : '')}
              strokeWidth={1.75}
            />
          </button>

          <div className="flex flex-col min-w-0">
            <span className="font-sans text-sm font-medium tracking-tight text-neutral-900 truncate">
              {formattedPrice}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-light truncate">
              Envío a Colombia
            </span>
          </div>
        </div>

        {/* Right: Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={status !== 'idle'}
          className="flex-1 max-w-[190px] h-[44px] rounded-sm bg-neutral-950 px-4 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-sm transition-all hover:bg-camel-dark active:scale-[0.98] disabled:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {status === 'loading' && (
            <span className="flex items-center gap-1.5 animate-in fade-in duration-200">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Añadiendo...
            </span>
          )}
          {status === 'added' && (
            <span className="flex items-center gap-1.5 animate-in fade-in duration-200 text-green-400 font-medium">
              <Check className="h-3.5 w-3.5 scale-110" strokeWidth={3} /> Añadido
            </span>
          )}
          {status === 'idle' && <span>Añadir al carrito</span>}
        </button>
      </div>
    </div>
  )
}
