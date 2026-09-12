'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Product } from '@/types'
import { ProductCard } from '@/components/product-card'
import { ChevronLeft, ChevronRight, Sparkles, Layers } from 'lucide-react'

interface ProductRecommendationCarouselProps {
  title: string
  subtitle: string
  tagline: string
  icon: 'sparkles' | 'layers'
  products: Product[]
}

function RecommendationCarouselRow({
  title,
  subtitle,
  tagline,
  icon,
  products,
}: ProductRecommendationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

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

  if (!products || products.length === 0) return null

  return (
    <section className="py-14 md:py-20 border-t border-neutral-200/50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-camel-dark font-medium mb-2">
              {icon === 'sparkles' ? (
                <Sparkles className="h-3.5 w-3.5 text-camel-dark" />
              ) : (
                <Layers className="h-3.5 w-3.5 text-camel-dark" />
              )}
              <span>{tagline}</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-neutral-950 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-[0.88rem] md:text-[0.93rem] text-neutral-500 font-light max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-all hover:border-neutral-900 hover:text-neutral-950 disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed"
              aria-label={`Ver anteriores ${title}`}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-all hover:border-neutral-900 hover:text-neutral-950 disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed"
              aria-label={`Ver siguientes ${title}`}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Mobile Swipe / Desktop Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x pb-4 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar"
        >
          {products.map((product) => (
            <div
              key={`${title}-${product.id}`}
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

export function ProductRecommendationCarousels({
  similarProducts = [],
  complementaryProducts = [],
}: {
  similarProducts?: Product[]
  complementaryProducts?: Product[]
}) {
  return (
    <div className="bg-[#fdfbf7]">
      {/* 1. También te pueden gustar (Comparar) */}
      <RecommendationCarouselRow
        title="También te pueden gustar"
        subtitle="Piezas afines seleccionadas por su escala, lenguaje visual y acabado."
        tagline="Comparar alternativas"
        icon="sparkles"
        products={similarProducts}
      />

      {/* 2. Combínalo con (Complementar) */}
      <RecommendationCarouselRow
        title="Combínalo con"
        subtitle="Accesorios y complementos pensados para crear una composición en equilibrio."
        tagline="Inspiración & Composición"
        icon="layers"
        products={complementaryProducts}
      />
    </div>
  )
}
