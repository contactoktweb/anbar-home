'use client'

import { ProductCard } from '@/components/product-card'
import { mockProducts } from '@/lib/mock-products'
import Link from 'next/link'
import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function FeaturedProducts() {
  const carouselProducts = mockProducts.slice(0, 8)
  const extendedProducts = [...carouselProducts, ...carouselProducts, ...carouselProducts]
  
  const [currentIndex, setCurrentIndex] = useState(carouselProducts.length)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)

  // Detect items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(4)
      else setItemsPerView(2)
    }
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const nextSlide = useCallback(() => {
    setIsTransitioning(true)
    setCurrentIndex(prev => prev + 1)
  }, [])

  const prevSlide = useCallback(() => {
    setIsTransitioning(true)
    setCurrentIndex(prev => prev - 1)
  }, [])

  // Auto scroll
  useEffect(() => {
    if (isHovered) return
    const intervalId = setInterval(nextSlide, 3500)
    return () => clearInterval(intervalId)
  }, [isHovered, nextSlide])

  // Handle infinite loop jumping
  useEffect(() => {
    if (currentIndex >= carouselProducts.length * 2) {
      const timeoutId = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(currentIndex - carouselProducts.length) 
      }, 800)
      return () => clearTimeout(timeoutId)
    }
    if (currentIndex <= 0) {
      const timeoutId = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(currentIndex + carouselProducts.length)
      }, 800)
      return () => clearTimeout(timeoutId)
    }
  }, [currentIndex, carouselProducts.length])

  return (
    <section className="py-24 bg-neutral-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 tracking-wide">
              Piezas Destacadas
            </h2>
            <p className="text-neutral-500 font-light leading-relaxed">
              Selección curada de nuestros objetos más deseados. Añade un toque de sofisticación a tus espacios con estas piezas únicas.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/tienda"
              className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-neutral-800 hover:text-camel transition-colors pb-2 border-b border-neutral-300 hover:border-camel"
            >
              Ver Todo
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={prevSlide} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-800 hover:text-neutral-800" aria-label="Anterior">
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button onClick={nextSlide} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-800 hover:text-neutral-800" aria-label="Siguiente">
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-moving Carousel Row */}
      <div className="container mx-auto px-4 lg:px-8">
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Mobile Arrows positioned absolutely */}
          <button onClick={prevSlide} className="absolute left-1 top-1/3 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm shadow-sm border border-white/50 text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900 md:hidden" aria-label="Anterior">
            <ChevronLeft className="h-4 w-4 pr-[1px]" strokeWidth={1.5} />
          </button>
          <button onClick={nextSlide} className="absolute right-1 top-1/3 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm shadow-sm border border-white/50 text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900 md:hidden" aria-label="Siguiente">
            <ChevronRight className="h-4 w-4 pl-[1px]" strokeWidth={1.5} />
          </button>

          <div 
            className={`flex ${isTransitioning ? 'transition-transform duration-[800ms] ease-in-out' : ''}`}
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {extendedProducts.map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="w-1/2 lg:w-1/4 flex-shrink-0 px-2 lg:px-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
