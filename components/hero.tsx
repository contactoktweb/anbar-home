import Image from 'next/image'
import { HeroCarousel } from '@/components/hero-carousel'

export function Hero({ data }: { data?: any }) {
  const subtitle = data?.heroSubtitle || ''
  const tagline = data?.heroTagline || 'El arte de habitar con calma'
  const cta = data?.heroCta || 'Descubrir'

  const defaultImages = [
    { src: '/Blogs-Anbar-1png.webp', alt: 'Interior sereno', label: 'Summer Sale', href: '/category/summer-sale' },
    { src: '/Blogs-Anbar.png.webp', alt: 'Escultura de la mujer', label: 'Esculturas', href: '/category/esculturas' },
    { src: '/linea-suprema.png', alt: 'Línea Suprema', label: 'Línea Suprema', href: '/category/linea-suprema' },
    { src: '/Blogs-Anbar-2.png.webp', alt: 'Salón con luz natural', label: 'Accesorios', href: '/category/accesorios' },
  ]

  const images = data?.galleryImages?.length > 0 
    ? data.galleryImages.map((img: any, i: number) => ({
        src: img.imageUrl || defaultImages[i]?.src || '/Blogs-Anbar-1png.webp',
        alt: img.alt || defaultImages[i]?.alt || `Galería ${i + 1}`,
        label: img.label || defaultImages[i]?.label || 'Colección',
        href: img.href || defaultImages[i]?.href || '#'
      }))
    : defaultImages

  return (
    <section
      id="inicio"
      className="relative grid min-h-[calc(100dvh-76px)] grid-cols-1 lg:grid-cols-2 bg-gradient-to-b from-ivory to-white"
    >
      {/* Izquierda: Información del Hero */}
      <div className="relative z-10 hidden flex-col items-center justify-center px-6 py-12 text-center mix-blend-multiply lg:flex lg:py-20">
        
        {/* Outline de arco decorativo sutil */}
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70vh] w-auto -translate-x-1/2 -translate-y-1/2 text-camel/40"
          viewBox="0 0 400 520"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="arch-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M40 520V220a160 160 0 0 1 320 0v300"
            stroke="url(#arch-gradient)"
            strokeWidth="1.5"
          />
          <path
            d="M90 520V224a110 110 0 0 1 220 0v296"
            stroke="url(#arch-gradient)"
            strokeWidth="1.5"
          />
        </svg>

        {subtitle && (
          <span className="animate-fade-in mb-12 text-[0.75rem] font-medium uppercase tracking-[0.4em] text-camel-dark [animation-delay:200ms]">
            {subtitle}
          </span>
        )}

        <Image
          src="/Anbar_Home_Logo_Black.png"
          alt="Anbar Home"
          width={760}
          height={312}
          priority
          className="animate-fade-up h-auto w-[85vw] max-w-[400px] object-contain contrast-[1.2] brightness-[1.1] [animation-delay:400ms]"
        />

        <p className="animate-fade-up mt-10 max-w-sm text-balance font-serif text-2xl font-light leading-relaxed text-foreground/75 md:text-3xl [animation-delay:800ms]">
          {tagline}
        </p>

        <div className="animate-fade-up mt-12 flex flex-col items-center gap-6 [animation-delay:1100ms]">
          <a
            href="#concepto"
            className="group text-xs uppercase tracking-[0.3em] text-foreground/70"
          >
            {cta}
            <span className="mx-auto mt-3 block h-10 w-px origin-top scale-y-100 bg-camel transition-transform duration-500 group-hover:scale-y-75" />
          </a>
        </div>
      </div>

      {/* Derecha: Carrusel de imágenes */}
      <div className="relative h-[calc(100dvh-76px)] w-full lg:h-auto lg:min-h-[calc(100dvh-76px)]">
        <HeroCarousel images={images} />
      </div>
    </section>
  )
}

