'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'

export function ProductImageZoom({ src, images = [], alt }: { src: string, images?: string[], alt: string }) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isZoomed, setIsZoomed] = useState(false)
  const [activeImage, setActiveImage] = useState(src)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)

  const allImages = [src, ...images].filter((v, i, a) => a.indexOf(v) === i)

  // Sync active image index for lightbox
  const activeIndex = allImages.indexOf(activeImage)

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goLightboxNext()
      if (e.key === 'ArrowLeft') goLightboxPrev()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, lightboxIndex])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const goLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % allImages.length)
  }

  const goLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  // ─── Desktop mouse-zoom handlers ───────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setPosition({ x, y })
  }

  return (
    <>
      {/* ─── Main image area ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 w-full">
        <div
          ref={imageRef}
          className="group relative aspect-square w-full overflow-hidden bg-[#F8F6F2] select-none"
          // Desktop: cursor zoom
          style={{ cursor: 'crosshair' }}
          // Desktop mouse zoom
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => {
            setIsZoomed(false)
            setTimeout(() => setPosition({ x: 50, y: 50 }), 300)
          }}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={activeImage}
            alt={alt}
            fill
            className="object-contain object-center mix-blend-multiply transition-transform duration-[400ms] ease-out"
            style={{
              transformOrigin: `${position.x}% ${position.y}%`,
              // Only apply zoom on md+ (desktop); on mobile stays scale(1)
              transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
            }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            draggable={false}
          />

          {/* Mobile maximize button – visible only on small screens */}
          <button
            className="absolute bottom-3 right-3 z-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-neutral-200 p-2.5 text-neutral-700 transition-all active:scale-95 md:hidden"
            onClick={() => openLightbox(activeIndex >= 0 ? activeIndex : 0)}
            aria-label="Ver imagen ampliada"
          >
            <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden border-2 transition-colors ${
                  activeImage === img ? 'border-camel-dark' : 'border-transparent hover:border-neutral-300'
                } bg-[#F8F6F2]`}
              >
                <Image
                  src={img}
                  alt={`${alt} - vista ${idx + 1}`}
                  fill
                  className="object-cover object-center mix-blend-multiply"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Fullscreen Lightbox ──────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-xs tracking-widest uppercase">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Image */}
          <div
            className="relative w-[90vw] h-[85vh] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`${alt} - vista ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Prev / Next arrows – only when multiple images */}
          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 p-3 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); goLightboxPrev() }}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 p-3 text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); goLightboxNext() }}
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === lightboxIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ver imagen ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
