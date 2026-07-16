'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export function ProductImageZoom({ src, images = [], alt }: { src: string, images?: string[], alt: string }) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isZoomed, setIsZoomed] = useState(false)
  const [activeImage, setActiveImage] = useState(src)
  const imageRef = useRef<HTMLDivElement>(null)

  const allImages = [src, ...images].filter((v, i, a) => a.indexOf(v) === i) // Unique images

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    
    // Calcula la posición porcentual del ratón
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setPosition({ x, y })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current || e.touches.length === 0) return
    
    const touch = e.touches[0]
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    
    const x = ((touch.clientX - left) / width) * 100
    const y = ((touch.clientY - top) / height) * 100
    
    // clamp values
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))
    
    setPosition({ x: clampedX, y: clampedY })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div 
        ref={imageRef}
        className="group relative aspect-square w-full overflow-hidden bg-[#F8F6F2] cursor-crosshair select-none"
        style={{ touchAction: isZoomed ? 'none' : 'pan-y' }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => {
          setIsZoomed(false)
          setTimeout(() => setPosition({ x: 50, y: 50 }), 300) // reset tras animación
        }}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          setIsZoomed(true)
          handleTouchMove(e)
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          setIsZoomed(false)
          setTimeout(() => setPosition({ x: 50, y: 50 }), 300)
        }}
        onTouchCancel={() => {
          setIsZoomed(false)
          setTimeout(() => setPosition({ x: 50, y: 50 }), 300)
        }}
      >
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-contain object-center mix-blend-multiply transition-transform duration-[400ms] ease-out"
          style={{
            transformOrigin: `${position.x}% ${position.y}%`,
            transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          draggable={false}
        />
      </div>
      <p className="text-center text-[11px] uppercase tracking-widest text-neutral-400 md:hidden mt-0">
        Mantén presionada la imagen para ver el detalle
      </p>
      
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
  )
}
