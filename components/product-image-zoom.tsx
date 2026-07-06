'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export function ProductImageZoom({ src, alt }: { src: string, alt: string }) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isZoomed, setIsZoomed] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    
    // Calcula la posición porcentual del ratón
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setPosition({ x, y })
  }

  return (
    <div 
      ref={imageRef}
      className="group relative aspect-square w-full overflow-hidden bg-[#F8F6F2] cursor-crosshair"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => {
        setIsZoomed(false)
        setTimeout(() => setPosition({ x: 50, y: 50 }), 300) // reset tras animación
      }}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-center mix-blend-multiply transition-transform duration-[400ms] ease-out"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
        }}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
    </div>
  )
}
