'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroCarouselProps {
  images: {
    src: string
    srcMobile?: string
    alt: string
    label?: string
    href?: string
  }[]
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!images || images.length <= 1) return
    const timer = setInterval(goToNext, 4500)
    return () => clearInterval(timer)
  }, [images.length, goToNext])

  if (!images || images.length === 0) return null

  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950 group/carousel">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {img.href ? (
            <Link href={img.href} className="group relative block h-full w-full">
              {/* Background ambient blur layer to fill margins seamlessly */}
              <Image
                src={img.src}
                alt=""
                fill
                className={`object-cover object-center blur-3xl opacity-40 scale-110 pointer-events-none ${img.srcMobile ? 'hidden md:block' : ''}`}
                aria-hidden="true"
              />
              {img.srcMobile && (
                <Image
                  src={img.srcMobile}
                  alt=""
                  fill
                  className="object-cover object-center blur-3xl opacity-40 scale-110 pointer-events-none md:hidden"
                  aria-hidden="true"
                />
              )}

              {/* Main crisp image with object-contain so it NEVER crops */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={`object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01] ${img.srcMobile ? 'hidden md:block' : ''}`}
                priority={index === 0}
                quality={90}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="100vw"
              />
              {img.srcMobile && (
                <Image
                  src={img.srcMobile}
                  alt={img.alt}
                  fill
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01] md:hidden"
                  priority={index === 0}
                  quality={90}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="100vw"
                />
              )}

              {/* Subtle bottom gradient overlay for readability when label exists */}
              {img.label && (
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90 pointer-events-none" />
              )}
              {img.label && (
                <div className="absolute bottom-10 left-8 md:bottom-14 md:left-12 z-10">
                  <h3 className="text-xl font-light tracking-wider text-white drop-shadow-md md:text-3xl">
                    {img.label}
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-camel transition-all duration-500 group-hover:w-12" />
                    <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/90 transition-all duration-300 group-hover:text-white">
                      Explorar
                    </span>
                  </div>
                </div>
              )}
            </Link>
          ) : (
            <div className="relative h-full w-full">
              {/* Background ambient blur layer */}
              <Image
                src={img.src}
                alt=""
                fill
                className={`object-cover object-center blur-3xl opacity-40 scale-110 pointer-events-none ${img.srcMobile ? 'hidden md:block' : ''}`}
                aria-hidden="true"
              />
              {img.srcMobile && (
                <Image
                  src={img.srcMobile}
                  alt=""
                  fill
                  className="object-cover object-center blur-3xl opacity-40 scale-110 pointer-events-none md:hidden"
                  aria-hidden="true"
                />
              )}

              {/* Main crisp image */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={`object-contain object-center ${img.srcMobile ? 'hidden md:block' : ''}`}
                priority={index === 0}
                quality={90}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="100vw"
              />
              {img.srcMobile && (
                <Image
                  src={img.srcMobile}
                  alt={img.alt}
                  fill
                  className="object-contain object-center md:hidden"
                  priority={index === 0}
                  quality={90}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="100vw"
                />
              )}
              {img.label && (
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 pointer-events-none" />
              )}
              {img.label && (
                <div className="absolute bottom-10 left-8 md:bottom-14 md:left-12 z-10">
                  <h3 className="text-xl font-light tracking-wider text-white drop-shadow-md md:text-3xl">
                    {img.label}
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-camel" />
                    <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/90">
                      Explorar
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      
      {/* Controles manuales (Flechas extra sutiles) */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 p-2 text-white/60 transition-all duration-500 hover:scale-110 hover:text-white opacity-0 group-hover/carousel:opacity-100 md:left-4"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" strokeWidth={0.75} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 p-2 text-white/60 transition-all duration-500 hover:scale-110 hover:text-white opacity-0 group-hover/carousel:opacity-100 md:right-4"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="h-8 w-8 md:h-12 md:w-12" strokeWidth={0.75} />
      </button>

      {/* Indicadores del carrusel */}
      <div className="absolute bottom-6 right-8 z-20 flex gap-2 md:bottom-8 md:right-12">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
