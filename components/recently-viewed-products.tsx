'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Product } from '@/types'
import { ProductCard } from '@/components/product-card'
import { ChevronLeft, ChevronRight, History } from 'lucide-react'

const STORAGE_KEY = 'anbar_recently_viewed'

interface RecentlyViewedProductsProps {
  excludeId?: string
  limit?: number
  title?: string
  subtitle?: string
}

export function RecentlyViewedProducts({
  excludeId,
  limit = 6,
  title = 'Vistos recientemente',
  subtitle = 'Continúa explorando las piezas que llamaron tu atención.',
}: RecentlyViewedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const loadProducts = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        setProducts([])
        return
      }
      const parsed: Product[] = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        setProducts([])
        return
      }

      const filtered = parsed
        .filter((p) => p && p.id && (!excludeId || (p.id !== excludeId && p.slug !== excludeId)))
        .slice(0, limit)

      setProducts(filtered)
    } catch {
      setProducts([])
    }
  }, [excludeId, limit])

  useEffect(() => {
    setMounted(true)
    loadProducts()

    const handleUpdate = () => loadProducts()
    window.addEventListener('anbar_recently_viewed_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('anbar_recently_viewed_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [loadProducts])

  // Update arrow state based on scroll position
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
      return () => {
        el.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [products, checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 280
    const scrollAmount = cardWidth * 1.5
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (!mounted || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-20 border-t border-neutral-200/50 bg-[#fbf9f4]/60">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-camel-dark font-medium mb-2">
              <History className="h-3.5 w-3.5 text-camel-dark" />
              <span>Tu historial</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-950 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-[0.88rem] text-neutral-500 font-light">
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop scroll arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-all hover:border-neutral-900 hover:text-neutral-950 disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Ver productos anteriores"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-all hover:border-neutral-900 hover:text-neutral-950 disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Ver siguientes productos"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Swipeable Carousel: Supports native finger swipe on mobile and smooth scroll on desktop */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x pb-4 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar"
        >
          {products.map((product) => (
            <div
              key={`recently-${product.id}`}
              className="w-[72%] sm:w-[46%] md:w-[31%] lg:w-[23.5%] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
