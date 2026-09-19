'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { optimizeImageUrl } from '@/lib/utils'

interface HeroCarouselProps {
  images: {
    src?: string
    srcMobile?: string
    videoDesktop?: string
    videoMobile?: string
    alt: string
    label?: string
    href?: string
  }[]
  showLabels?: boolean
}

export function HeroCarousel({ images, showLabels = false }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [aspectRatios, setAspectRatios] = useState<Record<number, { desktop?: string; mobile?: string }>>({})

  const handleDesktopMetadata = (index: number, e: React.SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget
    if (videoWidth && videoHeight) {
      setAspectRatios((prev) => ({
        ...prev,
        [index]: { ...prev[index], desktop: `${videoWidth} / ${videoHeight}` },
      }))
    }
  }

  const handleMobileMetadata = (index: number, e: React.SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget
    if (videoWidth && videoHeight) {
      setAspectRatios((prev) => ({
        ...prev,
        [index]: { ...prev[index], mobile: `${videoWidth} / ${videoHeight}` },
      }))
    }
  }

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrev()
    }
  }

  useEffect(() => {
    if (!images || images.length <= 1) return
    const timer = setInterval(goToNext, 5000)
    return () => clearInterval(timer)
  }, [images.length, goToNext])

  if (!images || images.length === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden bg-neutral-950 group/carousel touch-pan-y md:max-h-[460px] lg:max-h-[500px] xl:max-h-[540px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((img, index) => {
        const isActive = index === currentIndex
        const optimizedDesktopSrc = img.src ? optimizeImageUrl(img.src, 1440, 75) : ''
        const optimizedMobileSrc = img.srcMobile ? optimizeImageUrl(img.srcMobile, 800, 75) : (optimizedDesktopSrc || '')

        const desktopAspect = aspectRatios[index]?.desktop || '1915 / 821'
        const mobileAspect =
          aspectRatios[index]?.mobile ||
          (img.videoMobile?.includes('8995d4ba') ? '1 / 1' : '1080 / 1350')

        const renderVisualContent = () => (
          <>
            {/* Desktop Video o Imagen */}
            {img.videoDesktop ? (
              <video
                src={img.videoDesktop}
                poster={optimizedDesktopSrc || undefined}
                autoPlay
                muted
                loop
                playsInline
                preload={index === 0 ? "auto" : "metadata"}
                onLoadedMetadata={(e) => handleDesktopMetadata(index, e)}
                style={{ aspectRatio: desktopAspect }}
                className={`w-full h-auto md:max-h-[460px] lg:max-h-[500px] xl:max-h-[540px] block object-cover object-center ${img.videoMobile || optimizedMobileSrc ? 'hidden md:block' : ''}`}
              />
            ) : optimizedDesktopSrc ? (
              <img
                src={optimizedDesktopSrc}
                alt={img.alt}
                style={{ aspectRatio: desktopAspect }}
                className={`w-full h-auto md:max-h-[460px] lg:max-h-[500px] xl:max-h-[540px] block object-cover object-center ${img.videoMobile || optimizedMobileSrc ? 'hidden md:block' : ''}`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            ) : null}

            {/* Mobile Video o Imagen */}
            {img.videoMobile ? (
              <video
                src={img.videoMobile}
                poster={optimizedMobileSrc || undefined}
                autoPlay
                muted
                loop
                playsInline
                preload={index === 0 ? "auto" : "metadata"}
                onLoadedMetadata={(e) => handleMobileMetadata(index, e)}
                style={{ aspectRatio: mobileAspect }}
                className="w-full h-auto block object-cover md:hidden"
              />
            ) : optimizedMobileSrc ? (
              <img
                src={optimizedMobileSrc}
                alt={img.alt}
                style={{ aspectRatio: mobileAspect }}
                className="w-full h-auto block object-cover md:hidden"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            ) : null}

            {/* Sutil gradiente inferior si tiene etiqueta */}
            {showLabels && img.label && (
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90 pointer-events-none" />
            )}
            {showLabels && img.label && (
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
          </>
        )

        return (
          <div
            key={index}
            className={`w-full md:max-h-[460px] lg:max-h-[500px] xl:max-h-[540px] transition-opacity duration-1000 ease-in-out ${
              isActive ? 'relative opacity-100 z-10' : 'absolute inset-0 opacity-0 z-0 pointer-events-none'
            }`}
          >
            {img.href ? (
              <Link href={img.href} className="group relative block w-full">
                {renderVisualContent()}
              </Link>
            ) : (
              <div className="relative w-full">
                {renderVisualContent()}
              </div>
            )}
          </div>
        )
      })}

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
