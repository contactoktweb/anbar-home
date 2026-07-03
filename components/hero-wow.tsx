import { HeroCarousel } from '@/components/hero-carousel'

export function HeroWow() {
  const banners = [
    { 
      src: '/pc/imagen1.jpeg', 
      srcMobile: '/movil/imagen1.jpeg',
      alt: 'Lujo Silencioso - Anbar Home'
    },
    { 
      src: '/pc/imgaen2.jpeg', 
      srcMobile: '/movil/imagen2.jpeg',
      alt: 'Detalles que inspiran - Anbar Home'
    },
    { 
      src: '/pc/imagen3.jpeg', 
      srcMobile: '/movil/imagen3.jpeg',
      alt: 'Espacios únicos - Anbar Home'
    },
    { 
      src: '/pc/imagen4.jpeg', 
      srcMobile: '/movil/imagen3.jpeg',
      alt: 'Colección Exclusiva - Anbar Home'
    }
  ]

  return (
    <section
      id="inicio"
      className="relative w-full h-[calc(100dvh-76px)] min-h-[600px] bg-neutral-100 overflow-hidden"
    >
      <HeroCarousel images={banners} />
    </section>
  )
}
