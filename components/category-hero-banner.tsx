import Image from 'next/image'
import { optimizeImageUrl } from '@/lib/utils'

interface CategoryHeroBannerProps {
  data?: any
  currentSlug: string
  categoryName?: string
  categoryBanner?: {
    src?: string
    srcMobile?: string
  } | null
}

export function CategoryHeroBanner({
  data,
  currentSlug,
  categoryName = 'Colección',
  categoryBanner,
}: CategoryHeroBannerProps) {
  // Solo se usa la imagen subida directamente a esta categoría en Sanity
  const rawSrc = categoryBanner?.src
  const rawSrcMobile = categoryBanner?.srcMobile
  const alt = categoryName || 'Anbar Home'

  // Si la categoría tiene imagen de banner propia, mostrarla
  if (rawSrc) {
    const src = optimizeImageUrl(rawSrc, 1440, 75)
    const srcMobile = rawSrcMobile ? optimizeImageUrl(rawSrcMobile, 800, 75) : null

    return (
      <section className="w-full">
        <h1 className="sr-only">{categoryName} - Anbar Home</h1>
        {/* Desktop Image: 100% full width and 100% natural uncropped height */}
        <Image
          src={src}
          alt={alt}
          width={1440}
          height={810}
          className={`w-full h-auto block object-contain ${srcMobile ? 'hidden md:block' : ''}`}
          priority
          quality={75}
          sizes="100vw"
        />
        {/* Mobile Image: 100% full width and 100% natural uncropped height */}
        {srcMobile && (
          <Image
            src={srcMobile}
            alt={alt}
            width={800}
            height={1400}
            className="w-full h-auto block object-contain md:hidden"
            priority
            quality={75}
            sizes="100vw"
          />
        )}
      </section>
    )
  }

  // Si NO tiene imagen de fondo: mostrar banner elegante en tono Borgoña con tipografía del sitio
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#4b0d10] via-[#591014] to-[#400b0e] py-14 sm:py-16 md:py-20 lg:py-24 text-center border-b border-[#5d1216] shadow-md">
      <div className="relative mx-auto max-w-4xl px-6">
        <span className="inline-block text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.25em] text-[#E3C58B] uppercase">
          Colección Exclusiva
        </span>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide text-[#F5E2BE]">
          {categoryName}
        </h1>
        <div className="mt-5 mx-auto h-[1px] w-24 bg-gradient-to-r from-transparent via-[#E3C58B]/70 to-transparent" />
      </div>
    </section>
  )
}
